import { Request, Response, NextFunction } from "express";
const TeamManagementService = require('../services/teamManagement.service')

exports.editTeam = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
       const user = await TeamManagementService.editTeam(req, res, next)
       res.status(200).json({ message: "Team edited successfully", user });
    } catch (error) {
        next(error);
    }
}

exports.viewUserProfile = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await TeamManagementService.viewUserProfile(req, res, next)
        res.status(200).json({ user });
    } catch (err) {
        next(err)
    }
}

exports.retriveAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await TeamManagementService.retriveAllUsers(req, res, next)
      res.status(200).json({ users });
    } catch (err) {
        next(err)
    }
}

exports.suspendAccount = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await TeamManagementService.suspendAccount(req, res, next)
        res.status(200).json({ message: "Account suspended successfully", user });
    } catch (err) {
        next(err)
    }
}

exports.addUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await TeamManagementService.addUser(req.body, req)
        res.status(200).json({ message: "User added successfully", user });
    } catch (err) {
        next(err)
    }
}

