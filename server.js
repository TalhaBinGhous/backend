// const express=require("express");
// const cors=require("cors");
// const  mongoose = require("mongoose");
// const Contact = require("./models/contact");
// require("dotenv").config();
// const app=express();
// app.use(cors());

// app.use(express.json());

// app.get("/",(req,res)=>{
// res.send("Server is running");
// });
// app.post("/api/contact",async(req,res)=>{
// try {
//     const newContact=new Contact({
//         fullname:req.body.fullname,
//         email:req.body.email,
//         phone:req.body.phone,
//         subject:req.body.subject,
//         message:req.body.message

//     });
// const saveContact=await newContact.save();
// res.status(201).json({
// message:"Contact Has been Saved",
// contact:saveContact
// });

// } catch (error) {
//     res.status(500).json({
// message:"Contact Has not been Saved",
// error:error.message
//     });
// }
// });
// mongoose.connect(process.env.MONGODB_URI)
// .then(()=>{
// console.log("MongoDb connected");
// const PORT=process.env.PORT || 5000;
// app.listen(PORT,()=>{
// console.log(`Server is running on port ${PORT}`);
// });
// })
// .catch((error)=>{
// console.log("mongoDb connection error",error.message);
// });





const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/contact");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

// 1. POST ROUTE: Save contact
app.post("/api/contact", async (req, res) => {
    try {
        const newContact = new Contact({
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject,
            message: req.body.message
        });

        const savedContact = await newContact.save();

        res.status(201).json({
            message: "Contact has been saved",
            contact: savedContact
        });
    } catch (error) {
        res.status(500).json({
            message: "Contact has not been saved",
            error: error.message
        });
    }
});

// 2. GET ROUTE: Fetch contacts
// ADD THIS CODE HERE, BELOW THE POST ROUTE
app.get("/api/contact", async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({
            message: "Contacts could not be fetched",
            error: error.message
        });
    }
});



app.delete("/api/contact/:id", async(req,res)=>{
try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message:"Contact has been deleted "
    });
} catch (error) {
    res.status(500).json({
message:"Error in Deleting the data",
error:error.message
    });
}
});

app.put("/api/contact/:id", async (req,res)=>{
try {
    const updateContact=await Contact.findByIdAndUpdate(
        req.params.id,
        {
            fullname:req.body.fullname,
            email:req.body.email,
            phone:req.body.phone,
            subject:req.body.subject,
            message:req.body.message
        },
        {
            new:true,
            runValidators:true
        }
    );
    if(!updateContact){
        return res.status(404).json({
message:"COntact not found"
        });
    }
    res.status(200).json({
        message:"Contact has been updated",
        contact:updateContact
    })
} catch (error) {
    res.status(500).json({
        message:"Error updated contact details",
        error:eeror.message
    });
}
} );

// 3. MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });
