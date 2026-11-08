# BĂO CĂO CHáº Y THá»¬ NGHIá»†M TRá»°C TIáº¾P OPENLAB 3D
**Há»‡ thá»‘ng thá»±c hĂ nh thĂ­ nghiá»‡m sá»‘ 3D â€” KHTN THCS**  
*Thá»i gian cháº¡y thá»­*: 2026-11-07 | *Cá»•ng káº¿t ná»‘i*: `http://localhost:3000/`

---

## 1. Tá»•ng quan Tráº¡ng thĂ¡i Cháº¡y thá»­

MĂ¡y chá»§ mĂ´ phá»ng OpenLab 3D (Vite 8.3.5 / React 19 / Three.js 0.186 / TypeScript) Ä‘Ă£ Ä‘Æ°á»£c khá»Ÿi Ä‘á»™ng vĂ  kiá»ƒm tra chá»©c nÄƒng trá»±c tiáº¿p qua giao diá»‡n trĂ¬nh duyá»‡t thá»±c táº¿.

| Háº¡ng má»¥c kiá»ƒm tra | Äá»‹a chá»‰ / Cá»•ng | Tráº¡ng thĂ¡i | ÄĂ¡nh giĂ¡ |
| :--- | :--- | :--- | :--- |
| **MĂ¡y chá»§ Vite Dev Server** | `http://localhost:3000/` | **HOáº T Äá»˜NG (Ready in 886ms)** | MÆ°á»£t mĂ , 0 lá»—i biĂªn dá»‹ch |
| **KhĂ´ng gian phĂ²ng thĂ­ nghiá»‡m 3D** | Viewport trung tĂ¢m | **HIá»‚N THá» CHĂ‚N THá»°C** | Máº·t bĂ n gá»—, ká»‡ kĂ­nh trÆ°ng bĂ y, chá»‘t Ä‘á»‹nh vá»‹ |
| **MĂ´ phá»ng KĂ­nh hiá»ƒn vi 3D** | Module quang há»c vi mĂ´ | **HOĂ€N Háº¢O** | TrÆ°á»ng nhĂ¬n trĂ²n, láº¥y nĂ©t Z-focus, máº«u TrĂ¹ng giĂ y |
| **Máº¡ng NÆ¡-ron Planetary Cosmos** | Modal tri thá»©c vÅ© trá»¥ | **HOĂ€N Háº¢O** | VĂ²ng quá»¹ Ä‘áº¡o Ä‘á»“ng tĂ¢m, liĂªn káº¿t nhĂ¢n quáº£ CIA |
| **Báº£ng Ä‘iá»u khiá»ƒn & TÆ°Æ¡ng tĂ¡c cĂ¢n** | Floating Dock & Inspector | **CHĂNH XĂC** | Äo khá»‘i lÆ°á»£ng 50.00g, trá»« bĂ¬ TARE, Ä‘áº·t lĂªn bĂ n 3D |

---

## 2. Minh chá»©ng HĂ¬nh áº£nh Thá»±c táº¿ khi Cháº¡y thá»­

````carousel
![BĂ n thĂ­ nghiá»‡m 3D thá»±c táº¿](./screenshots/01_openlab_3d_running_preview.png)
<!-- slide -->
![Thanh danh má»¥c 36 thiáº¿t bá»‹](./screenshots/02_openlab_3d_equipment_sidebar.png)
<!-- slide -->
![MĂ´ phá»ng KĂ­nh hiá»ƒn vi quang há»c 3D](./screenshots/03_openlab_3d_microscope_mode.png)
<!-- slide -->
![Máº¡ng NÆ¡-ron Planetary Cosmos](./screenshots/04_openlab_3d_neural_network_modal.png)
<!-- slide -->
![Chi tiáº¿t NÆ¡-ron CĂ¢n Ä‘iá»‡n tá»­ & CĂ´ng thá»©c LaTeX](./screenshots/08_openlab_3d_device_detail_inspector.png)
<!-- slide -->
![CĂ¢n Ä‘iá»‡n tá»­ Ä‘áº·t trá»±c tiáº¿p trĂªn bĂ n 3D](./screenshots/12_openlab_3d_balance_on_bench.png)
````

---

## 3. CĂ¡c PhĂ©p Thá»­ Chá»©c NÄƒng ÄĂ£ Thá»±c Hiá»‡n

1. **PhĂ©p thá»­ 1: Táº£i mĂ´i trÆ°á»ng 3D toĂ n cáº£nh**
   - Viewport 3D gĂ³c rá»™ng, há»‡ tá»a Ä‘á»™ Ä‘o Ä‘áº¡c máº·t bĂ n rĂµ nĂ©t, cĂ¡c thiáº¿t bá»‹ máº«u trĂªn ká»‡ kĂ­nh Ä‘Æ°á»£c dá»±ng hĂ¬nh Ä‘áº§y Ä‘á»§.
   - Giao diá»‡n Planetary Cosmos Header hiá»ƒn thá»‹ Ä‘áº§y Ä‘á»§ cĂ¡c cĂ´ng cá»¥ Ä‘iá»u hÆ°á»›ng, phĂ­m táº¯t vĂ  cháº¿ Ä‘á»™ há»c sinh.

2. **PhĂ©p thá»­ 2: Má»Ÿ bĂ i thá»±c hĂ nh KĂ­nh hiá»ƒn vi quang há»c 3D**
   - Click chá»n bĂ i thá»±c hĂ nh *"Soi KĂ­nh hiá»ƒn vi 3D (8 Máº«u váº­t KHTN)"*.
   - Khung thá»‹ kĂ­nh trĂ²n phĂ³ng Ä‘áº¡i $100\times$ ($10\times \text{váº­t kĂ­nh} \times 10\times \text{thá»‹ kĂ­nh}$) hiá»ƒn thá»‹ rĂµ nĂ©t cáº¥u trĂºc TrĂ¹ng giĂ y (*Paramecium caudatum*): LĂ´ng bÆ¡i bao quanh, rĂ£nh miá»‡ng, khĂ´ng bĂ o tiĂªu hĂ³a.
   - Tráº¡ng thĂ¡i láº¥y nĂ©t: $\Delta z = 0.00\,\text{mm}$ (NĂ‰T HOĂ€N Háº¢O), kĂ¨m thÆ°á»›c Ä‘o vi mĂ´ $200\,\mu\text{m}$.

3. **PhĂ©p thá»­ 3: KhĂ¡m phĂ¡ Máº¡ng NÆ¡-ron Tri thá»©c VÅ© trá»¥ (Planetary Cosmos)**
   - Má»Ÿ giao diá»‡n máº¡ng nÆ¡-ron: 36 thiáº¿t bá»‹ Ä‘Æ°á»£c phĂ¢n táº§ng theo cĂ¡c quá»¹ Ä‘áº¡o Ä‘á»“ng tĂ¢m phĂ¡t sĂ¡ng.
   - Khi nháº¥p Ä‘Ăºp vĂ o CĂ¢n Ä‘iá»‡n tá»­ trĂªn bĂ n 3D, há»‡ thá»‘ng tá»± Ä‘á»™ng Ä‘á»‹nh vá»‹ vĂ  lĂ m ná»•i báº­t CĂ¢n Ä‘iá»‡n tá»­ cĂ¹ng cĂ¡c nĂºt nháº­n tĂ­n hiá»‡u vĂ o (Quáº£ cĂ¢n 50g, Khá»‘i nhĂ´m, Khá»‘i Ä‘á»“ng, Bi thĂ©p, Cá»‘c 250ml).
   - CĂ´ng thá»©c hiá»ƒn thá»‹ chuáº©n xĂ¡c:
     $$m_{\text{net}} = \max(0, m_{\text{gross}} - m_{\text{tare}})$$

4. **PhĂ©p thá»­ 4: TĂ¡c Ä‘á»™ng váº­t lĂ½ lĂªn CĂ¢n Ä‘iá»‡n tá»­**
   - Click Ä‘áº·t quáº£ cĂ¢n chuáº©n $50.00\,\text{g}$ lĂªn Ä‘Ä©a cĂ¢n.
   - NhĂ£n 3D bay trĂªn khĂ´ng gian thá»±c tá»± Ä‘á»™ng cáº­p nháº­t tá»« `â–ï¸ 0.00 g` sang `â–ï¸ 50.00 g`.
   - Háº¡ cĂ¢n tá»« ká»‡ kĂ­nh trÆ°ng bĂ y xuá»‘ng trá»±c tiáº¿p máº·t bĂ n gá»— 3D vá»›i nĂºt *"Xuá»‘ng bĂ n"*. CĂ¢n Ä‘á»‹nh vá»‹ chĂ­nh xĂ¡c á»Ÿ tĂ¢m bĂ n lĂ m viá»‡c.

