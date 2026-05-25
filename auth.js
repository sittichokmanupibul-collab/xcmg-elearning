import { supabase } from './supabase.js';

export async function registerUser(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { full_name: fullName } // ส่งข้อมูลไปให้ Database Trigger ใช้งาน
        }
    });

    if (error) {
        console.error("Supabase Error:", error);
        alert("สมัครสมาชิกไม่สำเร็จ: " + error.message); // ดูข้อความ error ที่นี่
        return null;
    }

    return data.user;
}