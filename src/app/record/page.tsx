"use client";

// Module
import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

// Style
import styles from '@/styles/Record/Record.module.css';

// Type
import type { ProfileResponse } from "@/app/api/user/profile/types";

export default function RecordPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);

    const [formData, setFormData] = useState({
        laps: 1,
        people: 1
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // 這裡可以添加表單驗證和提交邏輯
        alert('跑步記錄提交成功！');

        // 重置表單
        setFormData({
            laps: 1,
            people: 1
        });
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies:
    useEffect(() => {
        setIsLoading(false);
    }, [status]);

    const fetchUserProfile = useCallback(async () => {
        if (!session?.user?.email) {
            return;
        }

        setIsLoadingProfile(true);
        setProfileError(null);

        try {
            const response = await fetch("/api/user/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: session.user.email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errorMessage || `Error: ${response.status}`);
            }

            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            setProfileError(
                error instanceof Error ? error.message : "Failed to load profile",
            );
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoadingProfile(false);
        }
    }, [session?.user?.email]);

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserProfile();
        }
    }, [session, fetchUserProfile]);

    const handleLogin = useCallback(() => {
        signIn("google", { callbackUrl: window.location.href });
    }, []);

    const handleLogout = useCallback(() => {
        signOut({ callbackUrl: window.location.href });
    }, []);

    console.log(profileData)
    return (
        <div className={styles.container}>
            <section className={styles.formSection}>
                <h2 className={styles.formTitle}>記錄跑步</h2>
                <p className={styles.formDescription}>每一步都計數！填寫您的跑步資訊，為班級貢獻里程。</p>

                <div className={styles.formContainer}>
                    {isLoading ? (
                        <div className={styles.loading}>載入中...</div>
                    ) : session ? (
                        /* 已登入用戶顯示表單 */
                        <>
                            <div className={styles.userInfo}>
                                {session.user?.image && (
                                    <img
                                        src={session.user.image}
                                        alt="用戶頭像"
                                        className={styles.userAvatar}
                                    />
                                )}
                                <div className={styles.userDetails}>
                                    <p className={styles.welcomeMessage}>
                                        歡迎, {session.user?.name || "用戶"}
                                    </p>
                                    <p className={styles.userEmail}>{session.user?.email?.split("@")[0].toUpperCase()}@{session.user?.email?.split("@")[1]}</p>
                                    {isLoadingProfile ? (
                                        <p className={styles.loadingText}>載入用戶資料中...</p>
                                    ) : profileError ? (
                                        <p className={styles.errorText}>{profileError}</p>
                                    ) : profileData && (
                                        <p className={styles.userClass}>
                                            班級: {profileData.className || "未設定"}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={styles.logoutButton}
                                >
                                    登出
                                </button>
                            </div>

                            <form id="runningForm" onSubmit={handleSubmit} className={styles.runningForm}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="laps">跑步圈數</label>
                                    <input
                                        type="number"
                                        id="laps"
                                        name="laps"
                                        placeholder="2"
                                        min={1}
                                        value={formData.laps}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="duration">跑步人數</label>
                                    <input
                                        type="number"
                                        id="people"
                                        name="people"
                                        min="1"
                                        max="300"
                                        value={formData.people}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.buttonContainer}>
                                    <button type="submit" className={styles.submitButton}>提交記錄</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* 未登入用戶顯示登入界面 */
                        <div className={styles.loginPrompt}>
                            <p className={styles.loginMessage}>
                                請登入以記錄您的跑步數據
                            </p>
                            <button
                                onClick={handleLogin}
                                className={styles.googleLoginButton}
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" className={styles.googleIcon}>
                                    <path
                                        fill="currentColor"
                                        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                                    />
                                </svg>
                                使用 Google 登入
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.recentRecords}>
                <h2 className={styles.recordsTitle}>跑步記錄</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.recordsTable}>
                        <thead>
                            <tr>
                                <th>登記日期</th>
                                <th>圈數</th>
                                <th>人數</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025-03-28</td>
                                <td className={styles.distance}>2</td>
                                <td className={styles.className}>46</td>
                            </tr>
                            <tr>
                                <td>2025-03-26</td>
                                <td className={styles.distance}>2</td>
                                <td className={styles.className}>46</td>
                            </tr>
                            <tr>
                                <td>2025-03-24</td>
                                <td className={styles.distance}>2</td>
                                <td className={styles.className}>46</td>
                            </tr>
                            <tr>
                                <td>2025-03-22</td>
                                <td className={styles.distance}>1</td>
                                <td className={styles.className}>42</td>
                            </tr>
                            <tr>
                                <td>2025-03-20</td>
                                <td className={styles.distance}>3</td>
                                <td className={styles.className}>38</td>
                            </tr>
                            <tr>
                                <td>2025-03-18</td>
                                <td className={styles.distance}>2</td>
                                <td className={styles.className}>45</td>
                            </tr>
                            <tr>
                                <td>2025-03-16</td>
                                <td className={styles.distance}>1</td>
                                <td className={styles.className}>40</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}