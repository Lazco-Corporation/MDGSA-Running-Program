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
    const [logo, setLogo] = useState<string | null>('/icons/icon.png'); // 預設徽標路徑
    const [qrCodeSvg, setQrCodeSvg] = useState('');
    const [finalQrCode, setFinalQrCode] = useState('');
    const [qrColor, setQrColor] = useState('#1A348E'); // 更新為大寫顏色代碼，確保一致性
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoSizePercent = 35; // 徽標大小比例
    const clearAreaSizePercent = 35; // 中間透明區域大小比例

    // 完整的替換所有黑色為指定顏色的函數
    const replaceAllBlack = (svg: string, color: string) => {
        return svg
            .replace(/#000/g, color)
            .replace(/#000000/g, color)
            .replace(/fill="black"/g, `fill="${color}"`)
            .replace(/stroke="black"/g, `stroke="${color}"`);
    };

    // 移除SVG中的白色背景
    const removeWhiteBackground = (svg: string) => {
        // 移除填充白色的背景矩形
        svg = svg.replace(/<rect[^>]*width="100%"[^>]*height="100%"[^>]*fill="white"[^>]*\/>/g, '');
        // 移除可能的背景樣式
        svg = svg.replace(/style="background-color:\s*white"/g, 'style="background-color:transparent"');
        // 將任何可能的背景顏色改為透明
        svg = svg.replace(/background-color:\s*white/g, 'background-color:transparent');
        // 移除可能的背景填充
        svg = svg.replace(/background:\s*white/g, 'background:transparent');
        return svg;
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

        // 移除白色背景
        svg = removeWhiteBackground(svg);

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

    // 將 QR 碼和徽標結合的函數 - 使用完全透明的方式
    const combineQrCodeAndLogo = () => {
        if (!qrCodeSvg || !logo || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true }); // 明確啟用 alpha 通道
        if (!ctx) return;

        const qrSize = 300; // 固定的 QR 碼大小

        canvas.width = qrSize;
        canvas.height = qrSize;

        // 清除畫布為透明
        ctx.clearRect(0, 0, qrSize, qrSize);

        // 解析 SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(qrCodeSvg, 'image/svg+xml');

        // 確保 SVG 有透明背景
        const svgElement = svgDoc.documentElement;
        svgElement.style.backgroundColor = 'transparent';

        const svgString = new XMLSerializer().serializeToString(svgDoc);

        // 創建 QR 碼圖像
        const qrImg = new window.Image();
        qrImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

        qrImg.onload = () => {
            // 繪製 QR 碼
            ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);

            // 計算中央清除區域大小
            const clearSize = qrSize * (clearAreaSizePercent / 100);
            const clearX = qrSize / 2 - clearSize / 2;
            const clearY = qrSize / 2 - clearSize / 2;

            // 清除中央區域為透明
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // 黑色，但會被 destination-out 轉換為透明
            ctx.fillRect(clearX, clearY, clearSize, clearSize);

            // 恢復正常繪圖模式
            ctx.globalCompositeOperation = 'source-over';

            // 繪製中心的徽標
            const logoImg = new window.Image();
            logoImg.crossOrigin = "Anonymous";
            logoImg.src = logo;

            logoImg.onload = () => {
                const logoSize = qrSize * (logoSizePercent / 100);

                // 計算徽標繪製尺寸，保持原始比例
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

                // 將徽標置於中央區域
                const adjustedLogoX = qrSize / 2 - drawWidth / 2;
                const adjustedLogoY = qrSize / 2 - drawHeight / 2;

                // 繪製徽標（無需白色背景）
                ctx.drawImage(logoImg, adjustedLogoX, adjustedLogoY, drawWidth, drawHeight);

                // 轉換為數據 URL (使用PNG格式以確保支持透明度)
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
                        <img src={logo} alt="Logo" className={styles.logoImage} />
                    </div>
                )}
            </div>

            <div className={styles.buttonGroup}>
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
                    <div className={styles.qrCodeTransparentWrapper}>
                        <img
                            src={finalQrCode}
                            alt="QR Code with Logo"
                            className={styles.qrCodeImage}
                            style={{
                                background: 'none',
                                backgroundColor: 'transparent',
                                mixBlendMode: 'normal'
                            }}
                        />
                    </div>
                </div>
            ) : qrCodeSvg ? (
                <div className={styles.resultContainer}>
                    <div
                        className={styles.qrCodeContainerTransparent}
                        dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                        style={{ background: 'transparent' }}
                    />
                </div>
            ) : null}

            {/* 用於渲染組合後 QR 碼的隱藏畫布 */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};