const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema
const MicrofinanceSchema = new mongoose.Schema({
    microfinanceName: {
      type: String,
      required: true,
      trim: true,
    },
    microfinanceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    numberOfMembers: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
  });
  
  // Export the Microfinance model
//   const Microfinance = mongoose.model('Microfinance', MicrofinanceSchema);

// Pre-save hook to hash the password
MicrofinanceSchema.pre('save', async function (next) {
  try {
    const microfinance = this;

    // Hash the password only if it's new or has been modified
    if (!microfinance.isModified('password')) return next();

    // Check if password matches confirmPassword
    if (microfinance.password !== microfinance.confirmPassword) {
      throw new Error("Passwords don't match");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    microfinance.password = await bcrypt.hash(microfinance.password, salt);

    // Remove confirmPassword from the schema before saving
    microfinance.confirmPassword = undefined;

    next();
  } catch (error) {
    next(error);
  }
});

// Compare passwords (to be used during login)
MicrofinanceSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Microfinance = mongoose.model('Microfinance', MicrofinanceSchema);

// Signup Route
router.post('/signup', async (req, res) => {
    const { microfinanceName, microfinanceNumber, numberOfMembers, location, password, confirmPassword } = req.body;

    try {
        // Check if the microfinance account already exists
        const existingMicrofinance = await Microfinance.findOne({ microfinanceNumber });
        if (existingMicrofinance) {
            return res.status(400).json({ message: 'Microfinance account already exists' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        // Create a new microfinance account
        const newMicrofinance = new Microfinance({
            microfinanceName,
            microfinanceNumber,
            numberOfMembers,
            location,
            password,
            confirmPassword
        });

        // Save the new microfinance account to the database
        await newMicrofinance.save();

        res.status(201).json({ message: 'Microfinance account created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Signin Route
router.post('/signin', async (req, res) => {
    const { microfinanceNumber, password } = req.body;

    try {
        // Check if the microfinance account exists
        const microfinance = await Microfinance.findOne({ microfinanceNumber });
        if (!microfinance) {
            return res.status(400).json({ message: 'Invalid microfinance number or password' });
        }

        // Compare the entered password with the stored password
        const isMatch = await microfinance.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid microfinance number or password' });
        }

        // Success response (without JWT)
        res.status(200).json({ message: 'Signin successful', microfinance });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

const MemberSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    microfinanceNumber: {
      type: String, // Now a string to link by microfinance number
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  
  // Pre-save hook to hash the password
  MemberSchema.pre('save', async function (next) {
    try {
      const member = this;
  
      // Hash the password only if it's new or has been modified
      if (!member.isModified('password')) return next();
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      member.password = await bcrypt.hash(member.password, salt);
  
      next();
    } catch (error) {
      next(error);
    }
  });
  
  // Compare passwords (to be used during login)
  MemberSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  const Member = mongoose.model('Member', MemberSchema);

  // Sign Up Route
router.post('/signup', async (req, res) => {
    try {
      const { name, idNumber, phoneNumber, microNumber, password } = req.body;
  
      // Check if member already exists
      const existingMember = await Member.findOne({ idNumber });
      if (existingMember) {
        return res.status(400).json({ message: 'Member already exists' });
      }
  
      // Create a new member
      const newMember = new Member({
        name,
        idNumber,
        phoneNumber,
        microNumber,
        password,
      });
  
      await newMember.save();
      res.status(201).json({ message: 'Member registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  // Sign In Route
  router.post('/signin', async (req, res) => {
    try {
      const { idNumber, password } = req.body;
  
      // Find member by ID number
      const member = await Member.findOne({ idNumber });
      if (!member) {
        return res.status(400).json({ message: 'Invalid ID number or password' });
      }
  
      // Compare the password
      const isMatch = await member.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid ID number or password' });
      }
  
      res.status(200).json({ message: 'Sign-in successful', memberId: member._id });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

  const MemberContributionSchema = new mongoose.Schema({
    memberId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Member document
      required: true,
      ref: 'Member'
    },
    date: {
      type: Date,
      required: true,
      default: Date.now // Automatically set the date to the current date
    },
    debit: {
      type: Number,
      required: true,
      default: 0 // Amount debited (sent)
    },
    credit: {
      type: Number,
      required: true,
      default: 0 // Amount credited (received)
    },
    narration: {
      type: String,
      required: true,
      trim: true // Trim whitespace
    }
  });
  
  // Export the MemberContribution model
  const MemberContribution = mongoose.model('MemberContribution', MemberContributionSchema);

  // POST route to create a new contribution
router.post('/contributions', async (req, res) => {
    const { memberId, date, debit, credit, narration } = req.body;
  
    // Validate input
    if (!memberId || (!debit && !credit)) {
      return res.status(400).json({ message: 'Member ID and either debit or credit amount are required.' });
    }
  
    const newContribution = new MemberContribution({
      memberId,
      date,
      debit,
      credit,
      narration
    });
  
    try {
      const savedContribution = await newContribution.save();
      return res.status(201).json(savedContribution); // 201 Created
    } catch (error) {
      return res.status(500).json({ message: 'Error recording contribution', error });
    }
  });
  
  // GET route to retrieve contributions for a specific member
  router.get('/contributions/:memberId', async (req, res) => {
    const { memberId } = req.params;
  
    try {
      const contributions = await MemberContribution.find({ memberId }).sort({ date: -1 }); // Sort by date descending
      return res.status(200).json(contributions); // 200 OK
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving contributions', error });
    }
  });

  // PUT route to update an existing contribution
router.put('/contributions/:id', async (req, res) => {
    const { id } = req.params;
    const { date, debit, credit, narration } = req.body;
  
    // Validate input
    if (!debit && !credit) {
      return res.status(400).json({ message: 'Either debit or credit amount must be provided.' });
    }
  
    try {
      const updatedContribution = await MemberContribution.findByIdAndUpdate(
        id,
        {
          date,
          debit,
          credit,
          narration
        },
        { new: true, runValidators: true } // Return the updated document and run validators
      );
  
      if (!updatedContribution) {
        return res.status(404).json({ message: 'Contribution not found.' });
      }
  
      return res.status(200).json(updatedContribution); // 200 OK
    } catch (error) {
      return res.status(500).json({ message: 'Error updating contribution', error });
    }
  });

  // Define the schema for member loans
const MemberLoanSchema = new mongoose.Schema({
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member', // Reference to the Member schema
      required: true
    },
    loanAmount: {
      type: Number,
      required: true,
      min: 0, // Minimum loan amount should be 0 or greater
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: props => `Loan amount should not be negative.`
      }
    },
    loanBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    loanQualifiedAmount: {
      type: Number,
      required: true,
      min: 0, // Amount the member qualifies for
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: props => `Qualified loan amount should not be negative.`
      }
    },
    loanInterestRate: {
      type: Number,
      required: true,
      min: 0, // Interest rate as a percentage (e.g., 5% -> 5)
    },
    loanStartDate: {
      type: Date,
      required: true,
      default: Date.now // Loan initiation date
    },
    loanEndDate: {
      type: Date,
      required: true
    },
    loanStatus: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'defaulted'],
      default: 'pending'
    },
    loanPurpose: {
      type: String,
      required: true,
      trim: true // Purpose or description of the loan
    },
    repaymentSchedule: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      required: true
    },
    guarantors: [{
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      contact: { type: String, required: true }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const MemberLoan = mongoose.model('MemberLoan', MemberLoanSchema);


  

module.exports = router;
