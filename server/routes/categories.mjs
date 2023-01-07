import express from "express";

const router = express.Router();


import {authenticateToken} from "../middleware/authenticate.mjs";

import Category from "../model/Category.mjs";
import CategoryHelper from "../helper/CategoryHelper.mjs";
import isAuthorized from "../middleware/authorizationChecker.mjs";
import ApiError from "../model/ApiError.mjs";

router.get('/', async (req, res) => {
    const categoryHelper = new CategoryHelper();
    const result = await categoryHelper.getAllCategories();

    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json(result.data);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const categoryHelper = new CategoryHelper();
    const result = await categoryHelper.getItemById(id);

    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json(result);
    }
});

router.post('/create', authenticateToken, async (req, res) => {
    if(!req.user.isadministrator) return res.status(403).json(new ApiError('e-100'));
    const categoryHelper = new CategoryHelper();
    let {title} = req.body;
    // Add a new Category to db
    console.log("Create Category");
    console.log(req.body);
    const category = await Category.create(title);

    console.log(category);

    try {
        const status = await categoryHelper.storeCategory(category);
        console.log(status);
        return res.status(201).json({
            message: "Category created successfully",
            category: category
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const {title} = req.body;
    if (!id) return res.status(400).json({message: "Category id is missing"});
    if (!title) return res.status(400).json({message: "Title is required"});

    const categoryHelper = new CategoryHelper();
    const category = await Category.create(title).setId(id);

    const result = await categoryHelper.updateCategory(category);
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
    const categoryHelper = new CategoryHelper();
    // Unlink all questions from this category
    const unlinkResult = await categoryHelper.unlinkQuestionsFromCategory(id);
    const result = await categoryHelper.deleteItemById(id);
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

export default router;