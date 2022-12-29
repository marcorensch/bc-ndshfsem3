import express from "express";

const router = express.Router();


import {authenticateToken} from "../middleware/authenticate.mjs";

import Category from "../model/Category.mjs";
import CategoryHelper from "../helper/CategoryHelper.mjs";
import isAuthorized from "../middleware/authorizationChecker.mjs";
import ApiError from "../model/ApiError.mjs";

router.get('/', async (req, res) => {
    const categoryController = new CategoryHelper();
    const result = await categoryController.getAllCategories();

    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json(result.data);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const categoryController = new CategoryHelper();
    const result = await categoryController.getItemById(id);

    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json(result);
    }
});

router.post('/create', authenticateToken, async (req, res) => {
    let {title} = req.body;
    const userId = req.user.id;
    // Add a new Question to db
    console.log("Create Category");
    console.log(req.body);
    const category = new Category(title);

    try {
        const categoryController = new CategoryHelper();
        await categoryController.storeCategory(category);
        res.status(201).json({
            message: "Category created successfully",
            category: category
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const {title} = req.body;
    if (!id) return res.status(400).json({message: "Category id is missing"});
    if (!title) return res.status(400).json({message: "Title is required"});

    const categoryController = new CategoryHelper();
    const category = new Category(title).setId(id);

    const result = await categoryController.updateCategory(category);
    if (result.success && result.data.affectedRows === 1) {
        res.status(200).json(result.success);
    } else {
        res.status(500).json(result);
    }
});

router.delete('/:id', authenticateToken, isAuthorized("category"), async (req, res) => {
    // Delete a Question from db
    console.log("Delete Category");
    const id = req.params.id;
    if (!id) res.status(400).json({message: "Category Id is required"});
    const categoryController = new CategoryHelper();
    const result = await categoryController.deleteItemById(id);
    console.log(result);
    if (result.success && result.data.affectedRows === 1) {
        res.status(200).json(result.success);
    } else if(result.success && result.data.affectedRows === 0) {
        res.status(400).json({message: "Category not found"});
    } else {
        console.log("Any Error")
        res.status(500).json(new ApiError('e-999').setData(result));
    }

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