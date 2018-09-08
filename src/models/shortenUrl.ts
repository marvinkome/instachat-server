import { Schema, model } from 'mongoose';

const shortUrlSchema = new Schema({
    originalUrl: String,
    urlCode: { type: String, unique: true },
    shortUrl: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});

const shortUrl = model('ShortUrl', shortUrlSchema);

export default shortUrl;
