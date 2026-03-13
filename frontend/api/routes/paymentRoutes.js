// 🟦 [TEMPLATE: FINAL_CRASH_PROOF_PAYMENT]
const express = require('express');
const SSLCommerzPayment = require('sslcommerz-lts');
const router = express.Router();
const Student = require('../models/Student');

// ✅ NO SLASH AT THE END OF THIS LINK!
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
            success_url: `${SITE_URL}/api/payment/success/${tran_id}`,
            fail_url: `${SITE_URL}/api/payment/fail/${tran_id}`,
            cancel_url: `${SITE_URL}/api/payment/cancel`,
            ipn_url: `${SITE_URL}/api/payment/ipn`,
            shipping_method: 'No',
            product_name: 'Monthly Tuition Fee',
            product_category: 'Education',
            product_profile: 'non-physical-goods',
            cus_name: name,
            cus_email: 'student@kodandaschool.com',
            cus_add1: 'Kodanda',
            cus_city: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01700000000',
            value_a: studentId 
        };

        const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, process.env.IS_LIVE === 'true');
        sslcz.init(data).then(apiResponse => {
            res.status(200).json({ paymentUrl: apiResponse.GatewayPageURL });
        }).catch(err => {
            console.error("SSL Init Error:", err);
            res.status(500).json({ message: "SSLCommerz Initialization Failed" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during payment init" });
    }
});

// 🟢 ROUTE: PAYMENT SUCCESS (CRASH-PROOF REDIRECT)
router.post('/success/:tran_id', async (req, res) => {
    try {
        const studentId = req.body.value_a;

        if (studentId) {
            await Student.findOneAndUpdate(
                { studentId: studentId }, 
                { tuitionFeePaid: true }
            );
        }

        // Redirect safely back to React
        res.redirect(302, `${SITE_URL}/payment-success/${req.params.tran_id}`);
    } catch (error) {
        console.error("Payment Success Error:", error);
        res.redirect(302, `${SITE_URL}/payment-fail`);
    }
});

// 🔴 ROUTE: PAYMENT FAIL
router.post('/fail/:tran_id', async (req, res) => {
    res.redirect(302, `${SITE_URL}/payment-fail`);
});

// 🟡 ROUTE: PAYMENT CANCEL
router.post('/cancel', async (req, res) => {
    res.redirect(302, `${SITE_URL}/payment-fail`);
});

module.exports = router;