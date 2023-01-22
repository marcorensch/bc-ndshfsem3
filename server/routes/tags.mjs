import express from "express";
import {authenticateToken} from "../middleware/authenticate.mjs";
import isAuthorized from "../middleware/authorizationChecker.mjs";
import ApiError from "../model/ApiError.mjs";
import TagHelper from "../helper/TagHelper.mjs";
import Tag from "../model/Tag.mjs";
import TransportObject from "../model/TransportObject.mjs";

const router = express.Router();

router.get('/', async (req, res) => {
    const tagHelper = new TagHelper();
    const result = await tagHelper.getTags();

    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json(result.data);
    }
});

router.post('/create', authenticateToken, async (req, res) => {
    const tagHelper = new TagHelper();
    if(!req.user.isadministrator) return res.status(403).json(new ApiError('e-100'));
    let {title} = req.body;
    const tag = await Tag.create(title);

    try {
        await tagHelper.storeTag(tag);
        return res.status(201).json(new TransportObject().setSuccess(true).setMessage("Tag created successfully").setPayload(tag));
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const tagHelper = new TagHelper();
    const id = req.params.id;
    const {title} = req.body;

    if (!id) return res.status(400).json(new ApiError('t-317'));
    if (!title) return res.status(400).json(new ApiError('t-318'));

    const tag = await Tag.create(title);
    tag.setId(id);
    try {
        let result = await tagHelper.updateTag(tag);
        if (result.success && result.data.affectedRows === 1) {
            return res.status(200).json(new TransportObject().setSuccess(true).setMessage("Tag updated successfully").setPayload(tag));
        }
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') return res.status(400).json(new ApiError('t-322'));
        console.error(error);
        return res.status(500).json(new ApiError('e-999'));
    }
});

router.delete('/:id', authenticateToken, isAuthorized("category"), async (req, res) => {
    const tagHelper = new TagHelper();
    const id = req.params.id;

    if (!id) return res.status(400).json(new ApiError('t-317'));

    await tagHelper.unlinkQuestionsFromTag(id);
    const result = await tagHelper.deleteItemById(id);

    if (result.success && result.data.affectedRows === 1) {
        res.status(200).json(new TransportObject().setSuccess(true).setMessage("Tag deleted successfully"));
    } else if(result.success && result.data.affectedRows === 0) {
        res.status(400).json(new ApiError('t-331'));
    } else {
        console.log(result);
        res.status(500).json(new ApiError('e-999'));
    }
});

export default router;