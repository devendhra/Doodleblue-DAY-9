const User = require("../models/user.model");
const bcrypt = require("bcrypt");

class UserService{
    async signup(name, email, password){
        const existingUser = await User.findOne({email});
        if(existingUser){
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});
        return user;
    }   
    async getAllUsers(){
        const users = await User.find({isActive: true});
        return users;
    }

    async getUserById(id){
        const user = await User.findById(id);
        if(!user || !user.isActive){
            throw new Error("User not found");
        }
        return user;
    }

    async updateUser(id, data){
        const user = await User.findById(id);
        if(!user || !user.isActive){
            throw new Error("User not found");
        }
        if(data.password){
            data.password = await bcrypt.hash(data.password, 10);
        }
        const updated = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        return updated;
    }

    async softDeleteUser(id){
        const user = await User.findById(id);
        if(!user){
            throw new Error("User not found");
        }
        user.isActive = false;
        await user.save();
        return user;
    }

    async loginUser(email, password ){
        const user = await User.findOne({email}).select("+password");
        if(!user || !user.isActive){
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new Error("Invalid password");
        }
        const payload = {
            id: user_id,
            email: user.email,
            isActive: user.isActive,
        };
        const token = tokenService.generateToken(payload);
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return { user: userWithoutPassword, token};
    }
}

module.exports = new UserService();