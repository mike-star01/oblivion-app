# 💅 Ex Tracker – "Don’t Text Them" App Concept

## 🧠 Core Premise

A mobile app that helps users stay accountable and avoid texting their ex. It tracks the number of days since last contact and delivers roast or motivational messages daily.

---

## 🔧 Core Features (Simple MVP Code-Ready)

### 1. Track Streak (Firebase Firestore or LocalStorage)

* Store an integer: `daysSinceContact`
* Store a timestamp: `lastReset`
* On app load, calculate: `daysSinceContact = now - lastReset`
* Show a big number: **"Day X"**

### 2. Reset Button (UI + Logic)

* Button labeled: **"I Texted Them 😩"**
* On press:

  * Reset `lastReset` to `Date.now()`
  * Display: **"Streak reset. Stay strong 💔"**

### 3. Daily Roast Generator (Local or OpenAI)

* Array of static messages (or fetch from backend)

```js
const messages = [
  "You miss them? You also miss being disrespected?",
  "Texting your ex is like reheating McDonald's fries.",
  "They didn't even wash their sheets."
];
```

* On load, show random message of the day

### 4. Optional: Enter Ex Nickname

* Simple input field, store to variable `exName`
* Replace message placeholders like: `"Don't text ${exName}."`

---

## 🔥 Viral Angle Examples

* TikTok: "Day 14 of no contact... and this app roasted me again 😭"
* Screenshots: "You’re 27 days clean. We’re proud of you."

---

## 🏆 Expansion Ideas (For Later)

* "Revival warnings" if user resets more than 2x
* Streak-sharing (e.g. screenshot export button)
* Push notifications: "You’re doing amazing, don’t ruin it now 💅"
* AI-generated roast pack (OpenAI or local fine-tuned model)

---

## 🧪 Tech Stack Ideas

* **Frontend:** React Native or Expo
* **Backend (optional):** Firebase Firestore or Supabase
* **Data:** LocalStorage if offline-only MVP
* **Hosting:** App Store / Google Play or TestFlight
