# Sentinel Dashboard Architecture & UI Overview

This document provides a comprehensive technical overview of the Sentinel Dashboard, its "Zero-UI" design philosophy, and the component hierarchy utilized to deliver real-time voice threat analysis.

## 1. Design Philosophy: "The Iron Man HUD"
The interface ignores traditional SaaS layouts. Instead of sidebars and tables, it treats the screen as a **Heads-Up Display (HUD)**. The goal is to maximize immersion while keeping critical security metrics (Threat Score, Connection Status) peripheral but visible.

### Key Visual Pillars
*   **Aesthetics**: Cyberpunk, High-Contrast Dark Mode (`#050505`).
*   **Typography**: `Geist Mono` for data, custom Display font for headers.
*   **Interaction**: Buttonless flows where possible; hover states trigger sound effects.
*   **Motion**: Framer Motion for alerts; Three.js for the dynamic background universe.

---

## 2. Component Layer Architecture
The Dashboard (`Dashboard.tsx`) is built using a **Z-Index Layering System** to separate visualization from interaction.

### Layer 1: The Universe (Visualization)
*   **Component**: `<WorldGlobe />` (Three.js/Fiber)
*   **Purpose**: Acts as the reactive background. It is not a static image but a live 3D render that pulses based on the `threatScore`.
*   **Behavior**: When a threat is detected, the globe dims and recedes (opacity drops to 30%) to allow the Red Alert overlay to take focus.

### Layer 2: HUD Interface (Information)
A pointer-events-through layer containing the "Cockpit" elements:
*   **Top Left**: System Status (Online/Offline indicator) & Branding.
*   **Top Right**: Performance Telemetry.
    *   **Vultr Edge**: Latency visualizer (e.g., "45ms").
    *   **Raindrop**: Database connection status.
    *   **Upgrade Action**: Dynamic button visible only to non-premium users.
*   **Center**: The "Activator" Button.
    *   Designed like an "Arc Reactor".
    *   **State 1 (Standby)**: White pulsing ring.
    *   **State 2 (Armed)**: Red scale-up animation with radar ping effect.

### Layer 3: Intelligence & Alerts
*   **Component**: `<TranscriptOverlay />`
    *   Renders real-time speech-to-text at the bottom of the screen.
    *   Uses a "Matrix fade" effect for old text.
*   **Component**: `<AlertSystem />`
    *   **Trigger**: Fires when `threatScore > 50`.
    *   **UI**: A full-screen modal featuring a "Threat Meter" gauge.
    *   **Actions**: "Dismiss" (Safe) or "Engage Ghost Mode" (Counter-Measure).

### Layer 4: Ghost Protocol (Premium Feature)
*   **Component**: `<GhostInterceptor />`
    *   **Access**: Locked behind the `<PaymentGateway />` (Stripe).
    *   **Function**: Replaces the Transcript Overlay. It takes over the user's microphone/speaker to "speak" to the scammer using AI-generated audio, effectively intercepting the attack.

---

## 3. Data Flow & Hooks
The dashboard is powered by a custom hook architecture to separate logic from UI.

### `useWebSocket.ts` (The Nervous System)
*   **Input**: Raw audio blobs from microphone.
*   **Output**: Real-time JSON stream (`{ is_threat: boolean, score: number, transcript: string }`).
*   **Latency**: Optimized for <500ms roundtrip.

### `useAudioRecorder.ts`
*   Manages the `MediaRecorder` API.
*   Slices audio into 500ms chunks (TimeSlice) for low-latency streaming.

### `useSoundEffects.ts`
*   Provides auditory feedback (Clicks, Hover hums, Alarm sirens).
*   Essential for the "tactile" feel of the digital interface.

### `useAuth.ts`
*   Manages user identity (WorkOS).
*   **Dev Mode Bypass**: Automatically injects a "Dev Agent" profile when running on localhost to skip authentication.

---

## 4. User Journeys (Tasks)

### Task A: The Guardian Flow (Standard)
1.  **Arm System**: User clicks the Center Button. Status changes to "SYSTEM ARMED".
2.  **Monitor**: User speaks. Text appears in the overlay.
3.  **Threat Detected**:
    *   Background dims.
    *   Red Alert Modal popups with sound effect.
    *   **Decision**: User dismisses (False Positive) or investigates.

### Task B: The Ghost Flow (Premium)
1.  **Threat Confirmed**: User clicks "Engage Ghost Mode" on the Alert Modal.
2.  **Paywall**: If Free Tier, `<PaymentGateway />` opens (Stripe Elements).
3.  **Activation**: If Premium, the UI shifts to "Ghost Mode" (Green Theme).
4.  **Execution**: The AI takes over the conversation.

---

## 5. Technical Stack Summary
| Component | Technology |
| :--- | :--- |
| **Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS + Custom CSS Variables |
| **3D Engine** | React Three Fiber (R3F) |
| **Motion** | Framer Motion |
| **Icons** | Lucide React |
| **State** | React Context + Local State |
