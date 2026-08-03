const { ROLES } = require("../constants/roles");
import { Request, Response, NextFunction } from "express";
const User = require("../models/User");
const Business = require("../models/business");
const BusinessMember = require("../models/businessMember");
import { RegisterBody } from "../interfaces";
import { error } from "node:console";

class TeamManagementService {

    async retriveAllUsers(req: any, res: Response, next: NextFunction) {
        const users = await Business.find({});

        if (!users) {
            throw new Error('No users found');
        }


        return users
    }

    async editTeam(req: any, res: Response, next: NextFunction) {
        const id = req.params.id
        const user = await Business.findById(id)

        if (!req.params.id) throw new Error('user id required')
        const { role, status } = req.body

        if (!role && !status) {
            throw new Error('at least one field required');
        }

        if (user.role == ROLES.SUPERADMIN) throw new Error('cannot edit a super admin account')

        if (req.user.role !== ROLES.SUPERADMIN) throw new Error('cannot edit a admin account')

        const updated = await User.findByIdAndUpdate(id, { role, status }, { new: true })


        return updated
    }

    // async viewUserProfile(req: any, res: Response, next: NextFunction) {
    //     const user = await Business.findById(req.params.id)

    //     if (!req.params.id) throw new Error('user id required')

    //     if (!user) throw new Error('no user found')

    //     if (req.params.id == req.user.id) throw new Error('user cannot view your own profile')

    //     return user
    // }

    async suspendAccount(req: any, res: Response, next: NextFunction) {
        const user = await Business.findById(req.params.id)

        if (!req.params.id) throw new Error('user id required')

        if (!user) throw new Error('no user found')
        if (req.user.role == ROLES.ADMIN) throw new Error('cannot suspend an admin account')
        if (user.role == ROLES.SUPERADMIN) throw new Error('cannot suspend a super admin account')
        if (req.params.id == req.user.id) throw new Error('user cannot suspend your own account')


        if (user.status === 'suspended') throw new Error('user already suspended')

        user.status = 'suspended'
        await user.save()

        return user
    }

    async addUser(data: any, req: any) {
        const { name, email, password, role } = data

        if (data.role == ROLES.SUPERADMIN || data.role == ROLES.ADMIN) throw new Error('forbidden')
        const businessID = req.user.id

        const exists = await User.findOne({ email })
        // console.log(exists)
        const existsInBusiness = await BusinessMember.findOne({ businessID, email })
        if (exists) throw new Error('user already exists')
        if (existsInBusiness) throw new Error('user already exists in your business')
             const company = await User.findById(businessID)
             if (!company) throw new Error('business not found')

        const newMember = await User.create({ name, email, password, role, businessId: businessID, companyName: company.companyName, subscriptionPlan: company.subscriptionPlan, subscriptionDuration: company.subscriptionDuration, subscribedAt: null, isVerified: null, subsciptionStatus: null, wallet: null })

       
        const businessMember = await BusinessMember.create({ businessID })
        return newMember && businessMember
    }

    async showBusinessStaff(req: any) {
        const businessID = req.user.id

        const staff = await User.find({
            businessId: businessID,
            role: { $ne: ROLES.ADMIN }
        });

        return staff
    }
}

//delete user

//fetch all products

//total inventory value

//low stock

//out of stock

module.exports = new TeamManagementService()