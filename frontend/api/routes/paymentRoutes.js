// Replace the top of your paymentRoutes.js with this:
const express = require('express');
const SSLCommerzPayment = require('sslcommerz-lts');
const router = express.Router();
const Student = require('../models/Student');

const SITE_URL = "https://kodanda-school-project-v2.vercel.app";

// ... the rest of your routes below

// Use your Vercel URL
const SITE_URL = "https://kodanda-school-project-v2.vercel.app";

// 🟢 ROUTE: INITIALIZE PAYMENT
router.post('/init', async (req, res) => {
    try {
        const { studentId, name, amount } = req.body;
        const tran_id = `REF_${Date.now()}`;

        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: tran_id,
            // FIX: Changed localhost to the actual Vercel API URL
            success_url: `${SITE_URL}/api/payment/success/${tran_id}`,
            fail_url: `${SITE_URL}/api/payment/fail/${tran_id}`,
            cancel_url: `${SITE_URL}/api/payment/cancel`,
            ipn_url: `${SITE_URL}/api/payment/ipn`,
            shipping_method: 'No',
            product_name: 'Monthly Tuition Fee',
            cus_name: name,
            cus_email: 'student@kodandaschool.com',
            cus_phone: '01700000000',
            value_a: studentId 
        };

        const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, process.env.IS_LIVE === 'true');
        sslcz.init(data).then(apiResponse => {
            res.status(200).json({ paymentUrl: apiResponse.GatewayPageURL });
        });
    } catch (error) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
});

// 🟢 ROUTE: PAYMENT SUCCESS
router.post('/success/:tran_id', async (req, res) => {
    try {
        const studentId = req.body.value_a;
        await Student.findOneAndUpdate({ studentId: studentId }, { tuitionFeePaid: true });

        // FIX: Redirect back to the Frontend Success page on Vercel
        res.redirect(`${SITE_URL}/payment-success/${req.params.tran_id}`);
    } catch (error) {
        res.redirect(`${SITE_URL}/payment-fail`);
    }
});

// 🔴 ROUTE: PAYMENT FAIL
router.post('/fail/:tran_id', async (req, res) => {
    res.redirect(`${SITE_URL}/payment-fail`);
});

module.exports = router;