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
                                            班級: 未設定
                                            {/* 班級: {profileData?.className || "未設定"} */}
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
                                className={styles.gsiMaterialButton}
                            >
                                <div className={styles.gsiMaterialButtonState}></div>
                                <div className={styles.gsiMaterialButtonContentWrapper}>
                                    <div className={styles.gsiMaterialButtonIcon}>
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                            <path fill="none" d="M0 0h48v48H0z"></path>
                                        </svg>
                                    </div>
                                    <span className={styles.gsiMaterialButtonContents}>使用 Google 登入</span>
                                    <span style={{ display: "none" }}>使用 Google 登入</span>
                                </div>
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

                <div className={styles.viewMoreContainer}>
                    <a href="#" className={styles.viewMoreLink}>
                        查看更多記錄
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </section>
        </div>
    );
}