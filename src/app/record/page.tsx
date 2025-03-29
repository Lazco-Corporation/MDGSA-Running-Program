"use client";

// Module
import { useState } from 'react';

// Style
import styles from '@/styles/Record/Record.module.css';

export default function RecordPage() {
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        grade: '',
        class: '',
        date: '',
        distance: '',
        location: '',
        duration: '',
        comments: ''
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
        alert('跑步記錄提交成功！等待審核。');

        // 重置表單
        setFormData({
            name: '',
            studentId: '',
            grade: '',
            class: '',
            date: '',
            distance: '',
            location: '',
            duration: '',
            comments: ''
        });
    };

    return (
        <div className={styles.container}>
            <section className={styles.formSection}>
                <h2 className={styles.formTitle}>記錄我的跑步里程</h2>
                <p className={styles.formDescription}>每一步都計數！填寫您的跑步資訊，為班級貢獻里程。</p>

                <div className={styles.formContainer}>
                    <form id="runningForm" onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.required}>姓名</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="studentId" className={styles.required}>學號</label>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="grade" className={styles.required}>年級</label>
                                <select
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">請選擇</option>
                                    <option value="國一">國一</option>
                                    <option value="國二">國二</option>
                                    <option value="國三">國三</option>
                                    <option value="高一">高一</option>
                                    <option value="高二">高二</option>
                                    <option value="高三">高三</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="class" className={styles.required}>班級</label>
                                <select
                                    id="class"
                                    name="class"
                                    value={formData.class}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">請選擇</option>
                                    <option value="1班">1班</option>
                                    <option value="2班">2班</option>
                                    <option value="3班">3班</option>
                                    <option value="4班">4班</option>
                                    <option value="5班">5班</option>
                                    <option value="6班">6班</option>
                                    <option value="7班">7班</option>
                                    <option value="8班">8班</option>
                                    <option value="9班">9班</option>
                                    <option value="10班">10班</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="date" className={styles.required}>跑步日期</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="distance" className={styles.required}>跑步距離 (公里)</label>
                                <input
                                    type="number"
                                    id="distance"
                                    name="distance"
                                    step="0.01"
                                    min="0.1"
                                    max="50"
                                    value={formData.distance}
                                    onChange={handleChange}
                                    required
                                />
                                <div className={styles.helpText}>請輸入實際跑步距離，最多至小數點後兩位</div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="location">跑步地點</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="例：校園操場、明道公園等"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="duration">跑步時間 (分鐘)</label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                min="1"
                                max="300"
                                value={formData.duration}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>跑步證明</label>
                            <div className={styles.fileUpload}>
                                <span className={styles.fileIcon}>📷</span>
                                <p>上傳您的跑步APP截圖或運動手錶照片</p>
                                <input type="file" id="proof" name="proof" accept="image/*" />
                                <div className={styles.helpText}>支持的格式：JPG, PNG, GIF 等。大小限制：5MB</div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="comments">備註</label>
                            <textarea
                                id="comments"
                                name="comments"
                                placeholder="有什麼想分享的跑步心得嗎？"
                                value={formData.comments}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.submitButton}>提交記錄</button>
                        </div>
                    </form>
                </div>
            </section>

            <section className={styles.recentRecords}>
                <h2 className={styles.recordsTitle}>我最近的跑步記錄</h2>
                <table className={styles.recordsTable}>
                    <thead>
                        <tr>
                            <th>日期</th>
                            <th>距離 (公里)</th>
                            <th>地點</th>
                            <th>時間 (分鐘)</th>
                            <th>狀態</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2025-03-28</td>
                            <td>5.2</td>
                            <td>明道公園</td>
                            <td>32</td>
                            <td className={styles.statusApproved}>已認證</td>
                        </tr>
                        <tr>
                            <td>2025-03-26</td>
                            <td>3.8</td>
                            <td>校園操場</td>
                            <td>25</td>
                            <td className={styles.statusApproved}>已認證</td>
                        </tr>
                        <tr>
                            <td>2025-03-24</td>
                            <td>4.5</td>
                            <td>社區公園</td>
                            <td>28</td>
                            <td className={styles.statusPending}>審核中</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}