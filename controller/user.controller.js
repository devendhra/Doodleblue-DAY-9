const UserService = require("../services/user.service");

class UserController {
    async signup(req, res) {
        try{
            const { name, email, password } = req.body;
            if(!name || !email || !password) {
                return res.status(400).json({message:"All fields are required"});
            }
            const result = await UserService.signup(name, email, password);
            return res.status(201).json({message:"User created successfully", data: result});
        } catch (error) {
            return res.status(500).json({message:error.message});
        }
    }

    async getAllUsers(req, res) {
        try{
            const users = await UserService.getAllUsers();
            return res.status(200).json({message:"Users fetched successfully", data: users});
        } catch (error) {
            return res.status(500).json({message:error.message});
        }
    }

    async getAllUserProfiles(req, res) {
        try{
            const userProfiles = await UserService.getAllUserProfiles();
            return res.status(200).json({message:"User profiles fetched successfully", data: userProfiles});
        } catch (error) {
            return res.status(500).json({message:error.message});
        }
    }

    async getUserById(req, res) {
        try{
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            return res.status(200).json({message:"User fetched successfully", data: user});
        } catch (error) {
            return res.status(500).json({message:error.message});
        }
    }

    async updateUser(req, res) {
        try{
            const { id } = req.params;
            const { name, email, password } = req.body;
            const data = {};
            if(name) data.name = name;
            if(email) data.email = email;
            if(password) data.password = password;
            if(Object.keys(data).length === 0) {
                return res.status(400).json({message:"Nothing to update"});
            }
            const result = await UserService.updateUser(id, data);
            return res.status(200).json({message:"User updated successfully", data: result});
        } catch (error) {
            return res.status(500).json({message:error.message});
        }
    }

    async softDeleteUser(req, res) {
        try{
            const { id } = req.params;
            if(!id) {
                return res.status(400).json({message:"User ID is required"});
            }
            const result = await UserService.softDeleteUser(id);
            return res.status(200).json({message:"User deleted successfully", data: result});
        } catch (error) {
            return res.status(500).json({message:error.message});
        }
    }

    async login(req, res) {
        try{
            const { email, password } = req.body;
            if(!email || !password) {
                return res.status(400).json({message:"Email and password are required"});
            }
            const result = await UserService.login(email, password);
            return res.status(200).json({message:"User logged in successfully", data: result});
        } catch (error) {
            return res.status(401).json({message:error.message});
        }
    }

    async addUserProfile(req, res) {
        try{
            const userId = req.user.id;
            const { age, dob, bio, gender } = req.body;

            if(!userId) {
                return res.status(400).json({message:"User ID is required"});
            }

            const newUserprofile = await UserService.addUserProfile(userId, {age, dob, bio, gender});
            res.status(201).json({message:"User profile added successfully", data: newUserprofile});
        } catch (error) {
            if(error.code === 11000) {
                return res.status(409).json({message:"User profile already exists"});
            }
            return res.status(500).json({message:error.message});
        }
    }
}   

module.exports = new UserController();