"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/QRCode/qrcode.module.css';

export default function Page() {
    return (
        <main className={styles.main}>
            <QRCodeWithLogo />
        </main>
    );
}

const QRCodeWithLogo = () => {
    const [url, setUrl] = useState('https://run.mingdao.edu.tw');
    const [logo, setLogo] = useState<string | null>('/images/icon-04.png'); // 預設徽標路徑
    const [qrCodeSvg, setQrCodeSvg] = useState('');
    const [finalQrCode, setFinalQrCode] = useState('');
    const [borderStyle, setBorderStyle] = useState(true); // For toggling border style
    const [qrColor, setQrColor] = useState('#1A348E'); // 更新為大寫顏色代碼，確保一致性
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoSizePercent = 35; // 徽標大小比例
    const whiteBgSizePercent = 35; // 白色背景大小比例

    // 完整的替換所有黑色為指定顏色的函數
    const replaceAllBlack = (svg: string, color: string) => {
        return svg
            .replace(/#000/g, color)
            .replace(/#000000/g, color)
            .replace(/fill="black"/g, `fill="${color}"`)
            .replace(/stroke="black"/g, `stroke="${color}"`);
    };

    // 生成 QR 碼的函數
    const generateQRCode = (text: string) => {
        // QR 碼參數
        const typeNumber = 0; // 自動檢測
        const errorCorrectionLevel = 'H'; // 高級錯誤修正 - 對徽標覆蓋很重要

        const qr = (window as any).qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(text);
        qr.make();

        // 生成自定義顏色的 SVG
        let svg = qr.createSvgTag({
            cellSize: 8,
            margin: 4
        });

        // 將所有黑色替換為選定的顏色
        svg = replaceAllBlack(svg, qrColor);

        // 尋找位置檢測圖案模塊並添加特殊半徑
        // 這些是角落的三個較大的正方形圖案
        // 我們將使用字符串替換，因為在這個上下文中沒有 DOM

        // 首先，為所有模塊矩形添加圓角
        svg = svg.replace(/<rect/g, '<rect rx="2" ry="2"');

        // 然後，查找位置檢測圖案並給它們更大的圓角
        // 這種模式定位是近似的，可能需要調整
        // 位置檢測圖案通常以其尺寸來區分
        svg = svg.replace(/<rect ([^>]*width="[3-9][0-9]"[^>]*height="[3-9][0-9]"[^>]*|[^>]*height="[3-9][0-9]"[^>]*width="[3-9][0-9]"[^>]*)/g,
            '<rect rx="8" ry="8" $1');

        return svg;
    };

    // 處理徽標上傳的函數
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                if (event.target?.result) {
                    setLogo(event.target.result as string);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    // 將 QR 碼和徽標結合的函數
    const combineQrCodeAndLogo = () => {
        if (!qrCodeSvg || !logo || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const qrSize = 300; // 固定的 QR 碼大小

        canvas.width = qrSize;
        canvas.height = qrSize;

        // 解析 SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(qrCodeSvg, 'image/svg+xml');
        const svgString = new XMLSerializer().serializeToString(svgDoc);

        // 創建 QR 碼圖像 (使用原生 HTMLImageElement 而非 Next.js Image)
        const qrImg = new window.Image();
        qrImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

        qrImg.onload = () => {
            // 繪製 QR 碼
            ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);

            // 繪製中心的徽標
            const logoImg = new window.Image();
            logoImg.crossOrigin = "Anonymous";
            logoImg.src = logo;

            logoImg.onload = () => {
                const logoSize = qrSize * (logoSizePercent / 100);

                // 為徽標創建方形白色背景
                const bgSize = qrSize * (whiteBgSizePercent / 100);
                ctx.fillStyle = "white";
                ctx.fillRect(
                    qrSize / 2 - bgSize / 2,
                    qrSize / 2 - bgSize / 2,
                    bgSize,
                    bgSize
                );

                // 保持徽標的原始寬高比例繪製
                const logoAspect = logoImg.width / logoImg.height;
                let drawWidth = logoSize;
                let drawHeight = logoSize;

                // 調整尺寸以保持寬高比
                if (logoAspect > 1) {
                    // 較寬的徽標
                    drawHeight = logoSize / logoAspect;
                } else {
                    // 較高的徽標
                    drawWidth = logoSize * logoAspect;
                }

                // 將徽標置於白色區域中央
                const adjustedLogoX = qrSize / 2 - drawWidth / 2;
                const adjustedLogoY = qrSize / 2 - drawHeight / 2;

                // 繪製徽標
                ctx.drawImage(logoImg, adjustedLogoX, adjustedLogoY, drawWidth, drawHeight);

                // 轉換為數據 URL
                setFinalQrCode(canvas.toDataURL('image/png'));
            };

            // 處理圖像加載錯誤
            logoImg.onerror = () => {
                console.error('無法加載徽標圖像');
                // 在沒有徽標的情況下仍然保存 QR 碼
                setFinalQrCode(canvas.toDataURL('image/png'));
            };
        };
    };

    // 確保在顏色變更時重新生成QR碼
    const handleColorChange = (newColor: string) => {
        setQrColor(newColor);
    };

    // 加載 QRCode 庫並生成初始 QR 碼
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
        script.async = true;
        script.onload = () => {
            const generatedSvg = generateQRCode(url);
            setQrCodeSvg(generatedSvg);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // 當 URL 或顏色變更時重新生成 QR 碼
    useEffect(() => {
        if (typeof (window as any).qrcode !== 'undefined') {
            const generatedSvg = generateQRCode(url);
            setQrCodeSvg(generatedSvg);
        }
    }, [url, qrColor]);

    // 當 QR 碼或徽標變更時，結合兩者
    useEffect(() => {
        if (qrCodeSvg && logo) {
            combineQrCodeAndLogo();
        }
    }, [qrCodeSvg, logo]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>URL QRCode 生成器</h2>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    URL:
                </label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={styles.input}
                    placeholder="請輸入網址"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    QRCode 顏色:
                </label>
                <div className={styles.colorSelector}>
                    <input
                        type="color"
                        value={qrColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className={styles.colorPicker}
                    />
                    <input
                        type="text"
                        value={qrColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className={styles.colorInput}
                        placeholder="#000000"
                    />
                    <div className={styles.colorPresets}>
                        <button
                            onClick={() => handleColorChange('#1A348E')}
                            className={`${styles.colorPreset}`}
                            style={{ backgroundColor: '#1A348E' }}
                            title="海軍藍"
                        />
                        <button
                            onClick={() => handleColorChange('#E7398E')}
                            className={`${styles.colorPreset}`}
                            style={{ backgroundColor: '#E7398E' }}
                            title="桃紅色"
                        />
                        <button
                            onClick={() => handleColorChange('#107E7D')}
                            className={`${styles.colorPreset}`}
                            style={{ backgroundColor: '#107E7D' }}
                            title="藍綠色"
                        />
                        <button
                            onClick={() => handleColorChange('#333333')}
                            className={`${styles.colorPreset}`}
                            style={{ backgroundColor: '#333333' }}
                            title="黑色"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    上傳圖示:
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className={styles.input}
                />
                {logo && (
                    <div className={styles.logoPreview}>
                        {/* <p className={styles.previewLabel}>中間圖示:</p> */}
                        <img src={logo} alt="Logo" className={styles.logoImage} />
                    </div>
                )}
            </div>

            <div className={styles.buttonGroup}>
                {/* <button
                    onClick={() => {
                        const generatedSvg = generateQRCode(url);
                        setQrCodeSvg(generatedSvg);
                        if (logo) combineQrCodeAndLogo();
                    }}
                    className={styles.generateButton}
                >
                    生成二維碼
                </button> */}

                {finalQrCode && (
                    <button
                        onClick={() => {
                            // 創建下載連結
                            const link = document.createElement('a');
                            link.download = 'run-for-dream.png';
                            link.href = finalQrCode;
                            link.click();
                        }}
                        className={styles.downloadButton}
                    >
                        下載
                    </button>
                )}
            </div>

            {finalQrCode ? (
                <div className={styles.resultContainer}>
                    {/* <p className={styles.resultLabel}>您的帶徽標二維碼:</p> */}
                    <div className={`${styles.qrCodeWrapper} ${borderStyle ? styles.withShadow : ''}`}>
                        <img
                            src={finalQrCode}
                            alt="QR Code with Logo"
                            className={styles.qrCodeImage}
                        />
                    </div>
                    {/* <div className={styles.shadowToggle}>
                        <label className={styles.toggleLabel}>
                            <input
                                type="checkbox"
                                checked={borderStyle}
                                onChange={() => setBorderStyle(!borderStyle)}
                                className={styles.checkbox}
                            />
                            顯示邊框陰影
                        </label>
                    </div> */}
                </div>
            ) : qrCodeSvg ? (
                <div className={styles.resultContainer}>
                    {/* <p className={styles.resultLabel}>您的二維碼:</p> */}
                    <div
                        className={styles.qrCodeContainer}
                        dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                    />
                </div>
            ) : null}

            {/* <div className={styles.urlDisplay}>
                <p>掃描此二維碼可訪問: {url}</p>
            </div> */}

            {/* 用於渲染組合後 QR 碼的隱藏畫布 */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};