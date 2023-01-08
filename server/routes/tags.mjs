import express from "express";

const router = express.Router();


import {authenticateToken} from "../middleware/authenticate.mjs";

import isAuthorized from "../middleware/authorizationChecker.mjs";
import ApiError from "../model/ApiError.mjs";
import TagHelper from "../helper/TagHelper.mjs";
import Tag from "../model/Tag.mjs";

router.get('/', async (req, res) => {
    const tagHelper = new TagHelper();
    const result = await tagHelper.getTags();

    console.log(result);
    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json(result.data);
    }
});

router.post('/create', authenticateToken, async (req, res) => {
    if(!req.user.isadministrator) return res.status(403).json(new ApiError('e-100'));
    const tagHelper = new TagHelper();
    let {title} = req.body;
    // Add a new Category to db
    console.log("Create Tag");
    const tag = await Tag.create(title);

    console.log(tag);

    try {
        const status = await tagHelper.storeTag(tag);
        console.log(status);
        return res.status(201).json({
            message: "Tag created successfully",
            tag: tag
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const {title} = req.body;
    if (!id) return res.status(400).json({message: "Tag id is missing"});
    if (!title) return res.status(400).json({message: "Tag is required"});

    const tagHelper = new TagHelper();
    const tag = await Tag.create(title);
    tag.setId(id);
    let result;
    try {
        result = await tagHelper.updateTag(tag);
        if (result.success && result.data.affectedRows === 1) {
            return res.status(200).json(result.success);
        }
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') return res.status(400).json(new ApiError('c-322'));
        res.status(500).json(error);
    }

    console.log("Error while updating category", result);
    res.status(500).json(new ApiError('e-999'));
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