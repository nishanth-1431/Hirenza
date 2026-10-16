import React, { useRef, useEffect } from 'react';

/**
 * FluidInteractiveGradient
 * Highly reactive, ultra-vivid 3+ gradient fluid simulation matching Image 1:
 *  - Vivid Electric Sky Cyan & Aqua (#00F2FE, #00C6FF, #06B6D4)
 *  - Royal Violet, Deep Purple & Vivid Magenta (#7928CA, #9333EA, #C026D3)
 *  - Luminous Spring Mint & Emerald (#10E7B2, #34D399, #059669)
 *  - Neon Lime & Chartreuse Glow (#A3E635, #BEF264)
 *  - Luminous White/Ice Aurora Highlight (#FFFFFF, #CFFAFE)
 *  - Sunset Lavender & Mauve (#C084FC, #E879F9)
 *
 * Enhanced with fast mouse tracking (0.09 lerp), high displacement (0.85 - 1.2),
 * velocity-driven vortex ripples, and luminous multi-pass blending.
 */
const FluidInteractiveGradient = ({ className = "" }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let width = 0;
        let height = 0;

        const updateDimensions = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        // Highly reactive mouse physics with velocity and elastic pull
        const mouse = {
            x: window.innerWidth * 0.5,
            y: window.innerHeight * 0.45,
            targetX: window.innerWidth * 0.5,
            targetY: window.innerHeight * 0.45,
            vx: 0,
            vy: 0,
            speed: 0.085, // Fast, responsive fluid response
            activity: 0.5 // Ramps up when moving to create turbulent waves
        };

        let lastX = mouse.x;
        let lastY = mouse.y;

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;

            const dist = Math.hypot(mouse.targetX - lastX, mouse.targetY - lastY);
            mouse.activity = Math.min(2.5, mouse.activity + dist * 0.015);
            lastX = mouse.targetX;
            lastY = mouse.targetY;
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouse.targetX = e.touches[0].clientX - rect.left;
                mouse.targetY = e.touches[0].clientY - rect.top;
                mouse.activity = 1.8;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        // Expanded Palette Based on Image 1:
        // Positioned accurately to match Image 1:
        // 1. Dominant Royal Violet / Electric Purple in Top-Center & Center (baseX: 0.46, baseY: 0.28)
        // 2. Vivid Neon Lime & Spring Mint in Upper-Right & Mid-Right (baseX: 0.82, baseY: 0.28)
        // 3. Electric Sky Cyan & Deep Azure in Left & Center-Left (baseX: 0.18, baseY: 0.36)
        // 4. Luminous Turquoise & Aqua in Bottom-Center (baseX: 0.50, baseY: 0.82)
        // 5. Sunset Magenta / Orchid in Mid-Upper (baseX: 0.36, baseY: 0.20)
        // 6. Interactive Mouse Vortex with high elastic pull
        const fluidNodes = [
            {
                // Node 1: Electric Royal Violet & Deep Purple (Prominent Upper-Center like Image 1)
                colorStops: [
                    { offset: 0, color: 'rgba(147, 51, 234, 1.0)' },
                    { offset: 0.3, color: 'rgba(126, 34, 206, 1.0)' },
                    { offset: 0.6, color: 'rgba(107, 33, 168, 0.85)' },
                    { offset: 1, color: 'rgba(88, 28, 135, 0)' }
                ],
                radiusRatio: 0.9,
                baseX: 0.46,
                baseY: 0.26,
                freqX: 0.0013,
                freqY: 0.0010,
                ampX: 0.18,
                ampY: 0.16,
                phase: 0,
                mouseFactor: -0.85 // Opposes mouse movement for liquid push-pull
            },
            {
                // Node 2: Vivid Orchid / Magenta Beam (Blends into purple)
                colorStops: [
                    { offset: 0, color: 'rgba(192, 38, 211, 0.95)' },
                    { offset: 0.4, color: 'rgba(168, 85, 247, 0.8)' },
                    { offset: 1, color: 'rgba(126, 34, 206, 0)' }
                ],
                radiusRatio: 0.7,
                baseX: 0.34,
                baseY: 0.18,
                freqX: 0.0016,
                freqY: 0.0012,
                ampX: 0.16,
                ampY: 0.14,
                phase: Math.PI / 3,
                mouseFactor: -0.7
            },
            {
                // Node 3: Electric Sky Cyan & Deep Azure (Left Flank)
                colorStops: [
                    { offset: 0, color: 'rgba(0, 242, 254, 1.0)' },
                    { offset: 0.35, color: 'rgba(0, 198, 255, 0.95)' },
                    { offset: 0.7, color: 'rgba(2, 132, 199, 0.8)' },
                    { offset: 1, color: 'rgba(3, 105, 161, 0)' }
                ],
                radiusRatio: 0.85,
                baseX: 0.16,
                baseY: 0.38,
                freqX: 0.0011,
                freqY: 0.0015,
                ampX: 0.22,
                ampY: 0.20,
                phase: Math.PI / 2,
                mouseFactor: 0.9
            },
            {
                // Node 4: Neon Chartreuse & Luminous Lime (Upper Right, exact Image 1 yellow-green glow)
                colorStops: [
                    { offset: 0, color: 'rgba(190, 242, 100, 1.0)' },
                    { offset: 0.35, color: 'rgba(163, 230, 53, 0.95)' },
                    { offset: 0.7, color: 'rgba(132, 204, 22, 0.6)' },
                    { offset: 1, color: 'rgba(101, 163, 13, 0)' }
                ],
                radiusRatio: 0.75,
                baseX: 0.86,
                baseY: 0.22,
                freqX: 0.0014,
                freqY: 0.0011,
                ampX: 0.18,
                ampY: 0.16,
                phase: (Math.PI * 2) / 3,
                mouseFactor: 0.8
            },
            {
                // Node 5: Luminous Spring Mint & Emerald (Mid-Right Flank)
                colorStops: [
                    { offset: 0, color: 'rgba(52, 211, 153, 1.0)' },
                    { offset: 0.35, color: 'rgba(16, 231, 178, 0.95)' },
                    { offset: 0.7, color: 'rgba(13, 148, 136, 0.75)' },
                    { offset: 1, color: 'rgba(15, 118, 110, 0)' }
                ],
                radiusRatio: 0.8,
                baseX: 0.82,
                baseY: 0.52,
                freqX: 0.0010,
                freqY: 0.0013,
                ampX: 0.2,
                ampY: 0.2,
                phase: Math.PI,
                mouseFactor: 0.85
            },
            {
                // Node 6: Radiant Deep Aqua & Electric Turquoise (Bottom-Center & Bottom-Left)
                colorStops: [
                    { offset: 0, color: 'rgba(6, 182, 212, 1.0)' },
                    { offset: 0.4, color: 'rgba(14, 165, 233, 0.85)' },
                    { offset: 0.75, color: 'rgba(3, 105, 161, 0.6)' },
                    { offset: 1, color: 'rgba(2, 132, 199, 0)' }
                ],
                radiusRatio: 0.75,
                baseX: 0.45,
                baseY: 0.84,
                freqX: 0.0015,
                freqY: 0.0012,
                ampX: 0.22,
                ampY: 0.16,
                phase: (Math.PI * 4) / 3,
                mouseFactor: 0.75
            },
            {
                // Node 7: Lavender & Mauve Reflection (Bottom-Left)
                colorStops: [
                    { offset: 0, color: 'rgba(192, 132, 252, 0.9)' },
                    { offset: 0.45, color: 'rgba(147, 51, 234, 0.7)' },
                    { offset: 1, color: 'rgba(107, 33, 168, 0)' }
                ],
                radiusRatio: 0.65,
                baseX: 0.10,
                baseY: 0.86,
                freqX: 0.0009,
                freqY: 0.0014,
                ampX: 0.16,
                ampY: 0.16,
                phase: Math.PI / 1.5,
                mouseFactor: -0.6
            },
            {
                // Node 8: Direct Interactive Mouse Vortex (Follows Cursor Instantly)
                isMouseTracker: true,
                colorStops: [
                    { offset: 0, color: 'rgba(255, 255, 255, 0.9)' },
                    { offset: 0.2, color: 'rgba(0, 242, 254, 0.8)' },
                    { offset: 0.5, color: 'rgba(168, 85, 247, 0.6)' },
                    { offset: 0.8, color: 'rgba(52, 211, 153, 0.35)' },
                    { offset: 1, color: 'rgba(0, 0, 0, 0)' }
                ],
                radiusRatio: 0.52
            }
        ];

        let time = 0;

        const render = () => {
            time += 1;

            // Decay mouse activity smoothly back to baseline
            mouse.activity += (0.6 - mouse.activity) * 0.02;

            // Elastic spring interpolation for mouse coordinates
            mouse.vx = (mouse.targetX - mouse.x) * mouse.speed;
            mouse.vy = (mouse.targetY - mouse.y) * mouse.speed;
            mouse.x += mouse.vx;
            mouse.y += mouse.vy;

            // Base rich deep cyan & midnight oceanic teal foundation
            // Darkened tone specifically tuned for high contrast so white typography pops crisply
            const baseGrad = ctx.createLinearGradient(0, 0, width, height);
            baseGrad.addColorStop(0, '#031722'); // Midnight deep cyan
            baseGrad.addColorStop(0.35, '#05232e'); // Deep oceanic cyan/teal
            baseGrad.addColorStop(0.7, '#07303d'); // Rich deep teal
            baseGrad.addColorStop(1, '#02121a'); // Dark abyssal cyan
            ctx.fillStyle = baseGrad;
            ctx.fillRect(0, 0, width, height);

            const minDim = Math.min(width, height);

            // Render fluid gradient mesh with chromatic liquid blending (source-over)
            // Preserves deep, rich saturation of Purple, Deep Cyan, Lime, and Mint
            ctx.globalCompositeOperation = 'source-over';

            fluidNodes.forEach((node) => {
                let x, y, radius;
                radius = minDim * node.radiusRatio;

                if (node.isMouseTracker) {
                    x = mouse.x;
                    y = mouse.y;
                    radius = minDim * (node.radiusRatio + mouse.activity * 0.1);
                } else {
                    // Multi-harmonic fluid wave mathematics with activity surge
                    const act = mouse.activity;
                    const waveX = (Math.sin(time * node.freqX + node.phase) * 0.65 +
                                   Math.cos(time * (node.freqX * 1.6) + node.phase) * 0.35) * (width * node.ampX * act);
                    const waveY = (Math.cos(time * node.freqY + node.phase) * 0.65 +
                                   Math.sin(time * (node.freqY * 1.5) + node.phase) * 0.35) * (height * node.ampY * act);

                    // Dynamic elastic mouse displacement (high reactivity)
                    const dx = (mouse.x - width * 0.5);
                    const dy = (mouse.y - height * 0.5);
                    const mouseShiftX = dx * node.mouseFactor;
                    const mouseShiftY = dy * node.mouseFactor;

                    x = width * node.baseX + waveX + mouseShiftX;
                    y = height * node.baseY + waveY + mouseShiftY;
                }

                const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
                node.colorStops.forEach((stop) => {
                    grad.addColorStop(stop.offset, stop.color);
                });

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', updateDimensions);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover filter blur-[65px] md:blur-[90px] scale-120 opacity-95 transition-opacity duration-500"
            />
            {/* Darkened Deep Cyan Vignette & Ambient Scrim: Ensures 100% Text Legibility */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(4,25,34,0.48)_0%,rgba(2,18,25,0.72)_100%)] pointer-events-none" />
        </div>
    );
};

export default FluidInteractiveGradient;
