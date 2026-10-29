const User = require("../models/user.model");
const UserProfile = require("../models/user.profile.model");
const bcrypt = require("bcrypt");
const tokenService = require("../jwt/token.service");
const mongoose = require("mongoose");

class UserService{
    async signup(name, email, password){
        const existingUser = await User.findOne({email});
        if(existingUser){
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return userWithoutPassword;
    }   
    async getAllUsers(){
        const users = await User.find({isActive: true});    
        return users;
    }

    async getAllUserProfiles(){
        const users = await User.find({isActive: true});
        const userids = users.map(user => user._id);
        const userProfiles = await UserProfile.find({user: {$in: userids}});

        const userWithProfiles = users.map(user => {
            const profile = userProfiles.find((profile) => profile.user.toString() === user._id.toString());
            return {
                ...user.toObject(),
                profile: profile || null
            };
        });
        return userWithProfiles;
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

    async login(email, password ){
        const user = await User.findOne({email}).select("+password");
        if(!user){
            throw new Error("User not found");
        }
        if(!user.isActive){
            throw new Error("User is not active");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new Error("Invalid credentials");
        }
        const payload = {
            id: user._id,
            email: user.email,
            isActive: user.isActive,
        };
        const token = tokenService.generateToken(payload);
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return { user: userWithoutPassword, token};
    }

    async addUserProfile(userId, profileData){
        if(!mongoose.isValidObjectId(userId)){
            throw new Error("Invalid user ID");
        }

        const user = await User.findById(userId);
        
        if(!user){
            throw new Error("User not found");
        }
        let dob = profileData.dob;
        if(typeof dob === "string" && /^\d{2}-\d{2}-\d{4}$/.test(dob)){
            const [day, month, year] = dob.split("-");
            dob = `${year}-${month}-${day}`;
        }
        const userProfile = await UserProfile.create({
            user:user._id,
            age: profileData.age,
            dob,
            bio: profileData.bio,
            gender: profileData.gender,
        });
        user.profile = userProfile._id;
        await user.save();

        return userProfile;
    }
}

module.exports = new UserService();