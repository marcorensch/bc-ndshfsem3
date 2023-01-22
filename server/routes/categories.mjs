import express from "express";

const router = express.Router();


import {authenticateToken} from "../middleware/authenticate.mjs";

import Category from "../model/Category.mjs";
import CategoryHelper from "../helper/CategoryHelper.mjs";
import isAuthorized from "../middleware/authorizationChecker.mjs";
import ApiError from "../model/ApiError.mjs";
import TransportObject from "../model/TransportObject.mjs";
import transportObject from "../model/TransportObject.mjs";

router.get('/', async (req, res) => {
    const categoryHelper = new CategoryHelper();
    const onlyFavorites = req.query.onlyFavorites === "true";
    const result = await categoryHelper.getCategories(onlyFavorites);

    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json(result.data);
    }
});

router.get('/:id', async (req, res) => {
    const categoryHelper = new CategoryHelper();
    const id = req.params.id;
    const result = await categoryHelper.getItemById(id);
    if (result.success) {
        res.status(200).json(result.data[0]);
    } else {
        res.status(500).json(result);
    }
});

router.post('/create', authenticateToken, async (req, res) => {
    const categoryHelper = new CategoryHelper();
    if(!req.user.isadministrator) return res.status(403).json(new ApiError('e-100'));
    let {title} = req.body;
    const category = await Category.create(title);

    try {
        await categoryHelper.storeCategory(category);
        const transportObject = new TransportObject()
            .setSuccess(true)
            .setMessage("Category created successfully")
            .setPayload(category)
        return res.status(201).json(transportObject);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const categoryHelper = new CategoryHelper();
    const id = req.params.id;
    const {title, fav} = req.body;

    if (!id) return res.status(400).json({message: "Category id is missing"});
    if (!title) return res.status(400).json({message: "Title is required"});

    const category = await Category.create(title);
    category.setId(id);
    category.setFavorite(fav);

    try {
        let result = await categoryHelper.updateCategory(category);
        if (result.success && result.data.affectedRows === 1) {
            return res.status(200).json(new TransportObject().setSuccess(true).setMessage("Category updated successfully"));
        }
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') return res.status(400).json(new ApiError('c-322'));
        console.log(error);
        return res.status(500).json(new ApiError('e-999'));
    }
});

router.delete('/:id', authenticateToken, isAuthorized("category"), async (req, res) => {
    const categoryHelper = new CategoryHelper();
    const id = req.params.id;
    if (!id) return res.status(400).json(new ApiError('c-318'));

    await categoryHelper.unlinkQuestionsFromCategory(id);
    const result = await categoryHelper.deleteItemById(id);

    if (result.success && result.data.affectedRows === 1) {
        res.status(200).json(new TransportObject().setSuccess(true).setMessage("Category deleted successfully"));
    } else if(result.success && result.data.affectedRows === 0) {
        res.status(400).json(new ApiError('c-331'));
    } else {
        res.status(500).json(new ApiError('e-999').setData(result));
    }
});

export default router;