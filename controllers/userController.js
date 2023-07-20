const mongoose = require("mongoose");
const User = require("../models/User.js");
const createError = require("http-errors");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require('passport');



const getUsers = async (req, res) => {

    try {
        const users = await User.find().lean();
        res.status(200).render("routes/users", { users });
    } catch (error) {
        console.error(error);
        res.status(500).render(error, { errorMessage: "error getting the Users..." });
    }
};




const registerUser = async (req, res, next) => {
    try {
        //------------------- Validation ------------------------- //
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("registration", { errorMessage: errors.array() });
        };
        //------------------- Validation ------------------------- //

        const { firstName, lastName, email, password } = req.body;
    
        if (!firstName || !lastName || !email || !password) {
            return res.render('registration',{ errorMessage: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {

            console.log('Email already registered');
            return res.render('registration', { errorMessage: 'Email already registered. Try another email' });
        }

        // Genera el hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            displayName: firstName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });

        // Guarda el usuario en la base de datos
        await newUser.save();
        req.flash('successMessage', 'User registered successfully. Please log in.');
        return res.redirect('/login');
  
    } catch (error) {
        console.error(error.name, error.message);
        if (error.name === "ValidationError") {
            next(createError(422, error.message));
            return;
        }
        return res.render('error', { errorMessage: error.message });
    }
};


//This function will get a User based on his/her ID
const getUserById = async (req, res, next) => {
    try {
        //getting the given parameter
        const userId = req.params.userId;

        //Validating that the given ID match the pattern or is in MongoDB collection
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw createError(400, "Invalid user ID");
        }
        const user = await User.findById(userId).lean();

        if (!user) {
            throw createError(400, "User not found.")
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(422).json({ error: error.message });
        next(error);
    }
};




const updateUser = async (req, res, next) => {
    try {
        //getting the given parameter
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log(userId);
            return res.status(400).send({ message: "Invalid user ID" });
        };
        const { displayName, firstName, lastName } = req.body;

        const updatedData = {
            displayName: displayName,
            firstName: firstName,
            lastName: lastName,
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            throw createError(404, "The User does not exist. ");
        };
        res.status(201).json({ message: " Updated " });
        console.log("User updated...");

    } catch (error) {
        console.error(error.name, error.message);
        next(error);
    };
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log(userId);
            return res.status(400).send({ message: "Invalid user ID" });
        };

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully..." });
        console.log("* User deleted *");
    } catch (error) {
        console.error(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, "Invalid User ID."));
            return;
        }
        next(error);
    }
};



// const loginUser = async (req, res, next) => {
//     try {
        
//         const { loginEmail, loginPassword } = req.body;

//         const registeredUser = await User.findOne({ email: loginEmail }).lean();
//         console.log(registeredUser);

//         if (!registeredUser) {
//             console.log("Invalid email");
//             return res.status(401).render("login", {
//                 layout: "login",
//                 errorMessage: "Invalid email",
//             });
//         }
//         console.log(loginPassword, registeredUser.password, loginEmail);
//         const passwordMatch = await bcrypt.compare(loginPassword, registeredUser.password);
        

//         if (!passwordMatch) {
//             // Contraseña incorrecta
//             console.log("Contraseña incorrecta");
//             return res.status(401).render("login", {
//                 layout: "login",
//                 errorMessage: "invalid password",
//             });
//         };

//         res.redirect("/dashboard");

//     } catch (error) {
//         console.error(error);

//         res.status(500).render("error", {
//             errorMessage: "Server Error, we really sorry!",
//         });
//     }
// };



const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).render("error", {
                errorMessage: "Server Error, we're really sorry!",
            });
        }
        if (!user) {
            return res.status(401).render("login", {
                layout: "login",
                errorMessage: info.message,
            });
        }
        req.login(user, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).render("error", {
                    errorMessage: "Server Error, we're really sorry!",
                });
            }
            res.redirect("/dashboard");
        });
    })(req, res, next);
};


module.exports = { getUsers, getUserById, updateUser, deleteUser, registerUser, loginUser };