import express from "express";
const router = express.Router();


import {authenticateToken} from "../middleware/authenticate.mjs";

import Category from "../model/Category.mjs";
import CategoryController from "../controller/CategoryController.mjs";

router.get('/', async (req, res) => {
    const categoryController = new CategoryController();
    const result = await categoryController.getAllCategories();

    if(result.success){
        res.status(200).json(result.data);
    }else{
        res.status(500).json(result.data);
    }
});

router.post('/create', authenticateToken,  async (req, res) => {
    let {title, alias} = req.body;
    const userId = req.user.id;
    // Add a new Question to db
    console.log("Create Category");
    console.log(req.body);
    const category = new Category(title, alias);

    try{
        const categoryController = new CategoryController();
        await categoryController.storeCategory(category);
        res.status(201).json({
            message: "Category created successfully",
            category: category
        });
    }catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.post('/update', (req, res) => {
    // Update a Question in db
    console.log("Update a Question");
    console.log(req.body);
});

router.delete('/delete', (req, res) => {
    // Delete a Question from db
    console.log("Delete a Question");
    console.log(req.body);
});

router.post('/answer', (req, res) => {
    // Answer a Question
    console.log("Answer a Question");
    console.log(req.body);
});

router.get('/get', (req, res) => {
    // Get a Question and its answers
    console.log("Get a Question and its answers from database");
    console.log(req.body);
});

export default router;