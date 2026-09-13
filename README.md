# ✨ MAGD AI ✨ — Local-First Personal AI Platform

<div align="center">

# ✨ MAGD AI ✨
**Local-First Personal AI Platform for Android**

بيئة ذكاء اصطناعي مستقلة وشخصية تعمل بالكامل داخل هاتفك.

</div>

---

## 🌟 الرؤية وهيكلية النظام (Platform Architecture)

تطبيق **✨ MAGD AI ✨** ليس مجرد تطبيق محادثة، بل بيئة ذكاء اصطناعي كاملة ومحلية تعمل بدون إنترنت (Offline-First) وتعتمد على مبدأ الخصوصية المطلقة.

### 📱 أقسام ومساحات العمل في ✨ MAGD AI ✨

1. **🏠 الرئيسية (Home Dashboard):** شاشة رئيسية مخصصة تعرض الترحيب، الإجراءات السريعة، حالة النموذج النشط، والمشاريع والمحادثات الأخيرة.
2. **💬 المحادثة الأساسية (Chat Engine):** تدفق الإجابات المباشرة (Streaming)، تنسيق الكود والـ Markdown، إيقاف واستكمال التوليد، وإحصائيات السرعة والتوكنز.
3. **🧠 مركز الذاكرة (Memory Control Center):** حفظ الذكريات قصيرة وطويلة المدى، وتفضيلات المستخدم مع الاسترجاع التلقائي ذكياً.
4. **🔗 المشاريع (Projects Workspace):** مساحات عمل مستقلة تجمع المحادثات، والملفات، والذاكرة الخاصة بكل مشروع.
5. **📚 قاعدة المعرفة وذكاء الملفات (RAG Knowledge Base):** تقطيع واسترجاع المستندات دلالياً مع التوثيق والمصادر الدقيقة.
6. **🤖 منظومة الوكلاء والـ Workflows:** تشغيل تسلسلات ذكية بين الوكلاء (File Agent, Coding Agent, Android Agent, Research Agent).
7. **🛠️ مركز الأدوات (Utilities Hub):** حاسبة رياضية، محول وحدات، أدوات Base64 وRegex وUUID.
8. **🎓 وضع الدراسة والتأهيل (Study Mode):** اختبارات Quiz وبطاقات مراجعة Flashcards مع متابعة المستوى التكيفي.
9. **🌍 مركز الترجمة (Translation Center):** ترجمة فورية للنصوص والملفات بجانب بعضها البعض.
10. **🌱 المختبر التجريبي (Experimental Lab 💀):** تقنيات المستقبل مثل Live Vision، خادم Local Runtime API، وتكامل Termux.

---

## 🚀 البناء والتطوير (Build & Release)

### المتطلبات الأساسية
- Node.js `22.x`
- Yarn `1.22.x`
- JDK 17
- Android SDK / NDK

### أوامر التطوير
```bash
yarn install        # تثبيت المكتبات
yarn typecheck      # فحص الأنواع TypeScript
yarn test           # تشغيل الاختبارات
```

### GitHub Actions CI Workflow
يحتوي المستودع على سير عمل تلقائي في `.github/workflows/build-apk.yml` لبناء ملف الـ Release APK وتوقيعه باستخدام أسرار GitHub Secrets (`MY_KEYSTORE_JKS`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`).

---
✨ Built with passion for local-first AI empowerment.
