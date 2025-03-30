"use client";

// Module
import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// Style
import styles from '@/styles/Record/Record.module.css';

// Type
import type { ExtendedNextAuthSession } from "@/app/api/auth/[...nextauth]/types";
import type { AddedLapsResponse } from "@/app/api/user/logs/added-laps/types";


export default function RecordPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<ExtendedNextAuthSession | undefined | null>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [logsList, setLogsList] = useState<AddedLapsResponse>();

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
        var data = JSON.stringify({
            "email": userData?.user?.email,
            "laps": Number(formData.laps),
            "headcount": Number(formData.people)
        });

        fetch("/api/user/add-laps", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }).then((res) => res.status).then((data) => {
            if (data === 200) {
                Swal.fire({
                    title: "紀錄成功",
                    text: "回到首頁看看自己的班級線在第幾名吧!",
                    icon: "success",
                    confirmButtonText: "好的",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    customClass: {
                        container: "select-none",
                    },
                    focusConfirm: false,
                    backdrop: `
                      rgba(0,0,123,0.4)
                      url("/images/nyan-cat.gif")
                      left top
                      no-repeat
                    `,
                    preConfirm: () => {
                        router.push("/");
                    }
                });
            } else {
                Swal.fire({
                    title: "紀錄失敗",
                    text: "系統發生錯誤，請稍後再嘗試！",
                    icon: "error",
                    confirmButtonText: "好的",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    customClass: {
                        container: "select-none",
                    },
                    focusConfirm: false,
                    background: "#fff url(/images/trees.png)",
                    backdrop: `
                  rgba(0,0,123,0.4)
                  url("/images/nyan-cat.gif")
                  left top
                  no-repeat
                `,
                    preConfirm: () => {
                        router.push("/");
                    }
                });
            }
        });

        setFormData({
            laps: 1,
            people: 1
        });
    };

    const handleLogin = useCallback(() => {
        signIn("google");
    }, []);

    const handleLogout = useCallback(() => {
        signOut({ callbackUrl: window.location.href });
    }, []);

    useEffect(() => {
        setUserData(session as ExtendedNextAuthSession);
    }, [status, session]);

    useEffect(() => {
        if (userData?.belongsToMingdao === false) {
            Swal.fire({
                title: "登入失敗",
                text: "您必須使用明道中學所配發的帳號才能登入!",
                icon: "error",
                confirmButtonText: "好的",
                allowEscapeKey: false,
                allowOutsideClick: false,
                customClass: {
                    container: "select-none",
                },
                focusConfirm: false,
                background: "#fff url(/images/trees.png)",
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("/images/nyan-cat.gif")
                  left top
                  no-repeat
                `,
                preConfirm: () => {
                    signOut({ callbackUrl: "/" });
                }
            });
        }
        if (userData?.isGraduateClass === false) {

            Swal.fire({
                title: "登入失敗",
                text: "您必須是應屆畢業生或學校老師才能登入!",
                icon: "error",
                confirmButtonText: "好的",
                allowEscapeKey: false,
                allowOutsideClick: false,
                customClass: {
                    container: "select-none",
                },
                focusConfirm: false,
                background: "#fff url(/images/trees.png)",
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("/images/nyan-cat.gif")
                  left top
                  no-repeat
                `,
                preConfirm: () => {
                    signOut({ callbackUrl: "/" });
                }
            });
        }
        if (userData?.belongsToMingdao === true && userData?.isGraduateClass === true) {
            setIsLoading(false);
        }
    }, [userData])

    useEffect(() => {
        if (userData?.user?.email) {
            fetch("/api/user/logs/added-laps", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userData?.user?.email
                })
            })
                .then((res) => res.json())
                .then((data: AddedLapsResponse) => setLogsList(data));
        }

    }, [userData])

    function timestampToDate(timestamp: number) {
        const date = new Date(timestamp);
        const formattedDateTime = date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // 使用24小时制
        });
        return formattedDateTime;
    }

    return (
        <div className={styles.container}>
            <section className={styles.formSection}>
                <h2 className={styles.formTitle}>記錄跑步</h2>
                <p className={styles.formDescription}>每一步都計數！填寫您的跑步資訊，為班級貢獻里程。</p>

                <div className={styles.formContainer}>
                    {status === "loading" ? (
                        <div className={styles.loading}>載入中...</div>
                    ) : ((!isLoading && status === "authenticated" && userData) ? (
                        <>
                            <div className={styles.userInfo}>
                                {session.user?.image && (
                                    <img
                                        src={userData.user?.image!}
                                        alt="用戶頭像"
                                        className={styles.userAvatar}
                                    />
                                )}
                                <div className={styles.userDetails}>
                                    <p className={styles.welcomeMessage}>
                                        {userData.userAttributes?.userName + " " + (userData.userAttributes?.userIdentity === "stu" ? "同學" : "老師")}
                                    </p>
                                    <p className={styles.userEmail}>
                                        {(userData.userAttributes?.email)}

                                    </p>
                                    <p className={styles.userClass}>
                                        {(userData.isGraduateClass && userData.userAttributes?.userIdentity === "teach") && userData.userAttributes?.className}
                                        {(userData.userAttributes?.userIdentity === "stu" && userData.userAttributes?.className)}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={styles.logoutButton}
                                >
                                    登出
                                </button>
                            </div>

                            <form id="runningForm" onSubmit={handleSubmit} className={styles.runningForm}>
                                <div className={styles.formWrapper}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="laps" className={styles.formLabel}>跑步圈數</label>
                                        <input
                                            type="number"
                                            id="laps"
                                            name="laps"
                                            placeholder="2"
                                            min={1}
                                            max={10}
                                            value={formData.laps}
                                            onChange={handleChange}
                                            required
                                            className={styles.formInput}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="duration" className={styles.formLabel}>跑步人數</label>
                                        <input
                                            type="number"
                                            id="people"
                                            name="people"
                                            min="1"
                                            max="50"
                                            value={formData.people}
                                            onChange={handleChange}
                                            required
                                            className={styles.formInput}
                                        />
                                    </div>
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
                    ))}
                </div>
            </section>
            {(!isLoading && status === "authenticated") && (
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
                                {logsList?.addedLaps.map((logItem, index) => (
                                    <tr key={index}>
                                        <td>{timestampToDate(logItem.timestamp)}</td>
                                        <td className={styles.distance}>{logItem.laps}</td>
                                        <td className={styles.className}>{logItem.headcount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}