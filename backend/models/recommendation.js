import mongoose from "mongoose";

const recommendedUserSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        score: {
            type: Number,
            required: true
        },

        matchedSkills: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: ["PENDING", "INVITED", "ACCEPTED", "REJECTED"],
            default: "PENDING"
        }
    },
    { _id: false }
);

const recommendationSchema = new mongoose.Schema(
    {
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: true
        },

        hackathonKey: {
            type: String,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        recommendations: {
            type: [recommendedUserSchema],
            default: []
        },

        generatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// 🔑 Prevent duplicate recommendation generation per ticket
recommendationSchema.index({ ticket: 1 }, { unique: true });

export default mongoose.model("Recommendation", recommendationSchema);