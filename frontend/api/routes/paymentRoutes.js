const express = require('express');
const SSLCommerzPayment = require('sslcommerz-lts');
const router = express.Router();
const Student = require('../models/Student');

// NO trailing slash here to prevent URL errors
const SITE_URL = "https://kodanda-school-project-v2.vercel.app";

router.post('/init', async (req, res) => {
    try {
        const { studentId, name, amount } = req.body;
        const tran_id = `REF_${Date.now()}`;

        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: tran_id,
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
            if (apiResponse?.GatewayPageURL) {
                res.status(200).json({ paymentUrl: apiResponse.GatewayPageURL });
            } else {
                res.status(400).json({ message: "SSLCommerz session failed" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
});

router.post('/success/:tran_id', async (req, res) => {
    try {
        const studentId = req.body.value_a;
        await Student.findOneAndUpdate({ studentId: studentId }, { tuitionFeePaid: true });

        // Redirect directly to frontend success route
        res.redirect(`${SITE_URL}/payment-success/${req.params.tran_id}`);
    } catch (error) {
        res.redirect(`${SITE_URL}/payment-fail`);
    }
});

router.post('/fail/:tran_id', async (req, res) => {
    res.redirect(`${SITE_URL}/payment-fail`);
});

module.exports = router;