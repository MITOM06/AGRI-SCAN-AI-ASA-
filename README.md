
```
AGRI-SCAN-AI-ASA-
├─ apps
│  ├─ backend
│  │  ├─ .prettierrc
│  │  ├─ Dockerfile
│  │  ├─ eslint.config.mjs
│  │  ├─ nest-cli.json
│  │  ├─ package.json
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ app.controller.spec.ts
│  │  │  ├─ app.controller.ts
│  │  │  ├─ app.module.ts
│  │  │  ├─ app.service.ts
│  │  │  ├─ main.ts
│  │  │  └─ modules
│  │  │     ├─ auth
│  │  │     │  ├─ auth.controller.spec.ts
│  │  │     │  ├─ auth.controller.ts
│  │  │     │  ├─ auth.module.ts
│  │  │     │  ├─ auth.service.spec.ts
│  │  │     │  ├─ auth.service.ts
│  │  │     │  ├─ guards
│  │  │     │  │  └─ jwt-auth.guard.ts
│  │  │     │  └─ strategies
│  │  │     │     └─ jwt.strategy.ts
│  │  │     └─ users
│  │  │        ├─ users.module.ts
│  │  │        ├─ users.service.spec.ts
│  │  │        └─ users.service.ts
│  │  ├─ test
│  │  │  ├─ app.e2e-spec.ts
│  │  │  └─ jest-e2e.json
│  │  ├─ tsconfig.build.json
│  │  └─ tsconfig.json
│  ├─ mobile
│  │  ├─ .expo
│  │  │  ├─ devices.json
│  │  │  ├─ README.md
│  │  │  └─ web
│  │  │     └─ cache
│  │  │        └─ production
│  │  │           └─ images
│  │  │              └─ favicon
│  │  │                 └─ favicon-a4e030697a7571b3e95d31860e4da55d2f98e5e861e2b55e414f45a8556828ba-contain-transparent
│  │  │                    └─ favicon-48.png
│  │  ├─ app
│  │  │  ├─ auth
│  │  │  │  ├─ AuthHeader.tsx
│  │  │  │  ├─ forgot-password.tsx
│  │  │  │  ├─ login.tsx
│  │  │  │  ├─ otp-verification.tsx
│  │  │  │  ├─ register.tsx
│  │  │  │  └─ reset-password.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ profile.tsx
│  │  │  ├─ scan.tsx
│  │  │  └─ user.tsx
│  │  ├─ app.json
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ android-icon-background.png
│  │  │  ├─ android-icon-foreground.png
│  │  │  ├─ android-icon-monochrome.png
│  │  │  ├─ favicon.png
│  │  │  ├─ icon.png
│  │  │  └─ splash-icon.png
│  │  ├─ components
│  │  │  ├─ home
│  │  │  └─ ui
│  │  │     ├─ Button.tsx
│  │  │     └─ Input.tsx
│  │  ├─ index.ts
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ src
│  │  └─ tsconfig.json
│  └─ web
│     ├─ .next
│     │  └─ dev
│     │     ├─ build-manifest.json
│     │     ├─ cache
│     │     │  ├─ .rscinfo
│     │     │  ├─ chrome-devtools-workspace-uuid
│     │     │  ├─ next-devtools-config.json
│     │     │  └─ turbopack
│     │     │     └─ 23c46498
│     │     │        ├─ 00000003.sst
│     │     │        ├─ 00000004.sst
│     │     │        ├─ 00000005.sst
│     │     │        ├─ 00000006.meta
│     │     │        ├─ 00000009.meta
│     │     │        ├─ 00000010.meta
│     │     │        ├─ 00000016.sst
│     │     │        ├─ 00000017.sst
│     │     │        ├─ 00000018.sst
│     │     │        ├─ 00000020.meta
│     │     │        ├─ 00000022.meta
│     │     │        ├─ 00000023.meta
│     │     │        ├─ 00000029.sst
│     │     │        ├─ 00000030.sst
│     │     │        ├─ 00000031.sst
│     │     │        ├─ 00000032.meta
│     │     │        ├─ 00000035.meta
│     │     │        ├─ 00000036.meta
│     │     │        ├─ 00000039.sst
│     │     │        ├─ 00000040.meta
│     │     │        ├─ 00000045.sst
│     │     │        ├─ 00000046.meta
│     │     │        ├─ 00000051.sst
│     │     │        ├─ 00000052.meta
│     │     │        ├─ 00000057.sst
│     │     │        ├─ 00000059.meta
│     │     │        ├─ 00000063.sst
│     │     │        ├─ 00000064.sst
│     │     │        ├─ 00000065.sst
│     │     │        ├─ 00000067.meta
│     │     │        ├─ 00000069.meta
│     │     │        ├─ 00000070.meta
│     │     │        ├─ 00000073.sst
│     │     │        ├─ 00000074.meta
│     │     │        ├─ 00000079.sst
│     │     │        ├─ 00000080.meta
│     │     │        ├─ 00000088.sst
│     │     │        ├─ 00000089.meta
│     │     │        ├─ 00000094.sst
│     │     │        ├─ 00000095.meta
│     │     │        ├─ 00000100.sst
│     │     │        ├─ 00000101.meta
│     │     │        ├─ 00000106.sst
│     │     │        ├─ 00000107.meta
│     │     │        ├─ 00000112.sst
│     │     │        ├─ 00000113.meta
│     │     │        ├─ 00000118.sst
│     │     │        ├─ 00000119.meta
│     │     │        ├─ 00000124.sst
│     │     │        ├─ 00000125.meta
│     │     │        ├─ 00000133.sst
│     │     │        ├─ 00000134.sst
│     │     │        ├─ 00000135.sst
│     │     │        ├─ 00000136.meta
│     │     │        ├─ 00000139.meta
│     │     │        ├─ 00000140.meta
│     │     │        ├─ 00000143.sst
│     │     │        ├─ 00000144.meta
│     │     │        ├─ 00000149.sst
│     │     │        ├─ 00000150.meta
│     │     │        ├─ 00000155.sst
│     │     │        ├─ 00000157.meta
│     │     │        ├─ 00000161.sst
│     │     │        ├─ 00000162.meta
│     │     │        ├─ 00000170.sst
│     │     │        ├─ 00000171.sst
│     │     │        ├─ 00000172.sst
│     │     │        ├─ 00000173.meta
│     │     │        ├─ 00000176.meta
│     │     │        ├─ 00000177.meta
│     │     │        ├─ 00000183.sst
│     │     │        ├─ 00000184.meta
│     │     │        ├─ 00000189.sst
│     │     │        ├─ 00000190.meta
│     │     │        ├─ 00000195.sst
│     │     │        ├─ 00000196.meta
│     │     │        ├─ 00000201.sst
│     │     │        ├─ 00000202.sst
│     │     │        ├─ 00000203.sst
│     │     │        ├─ 00000204.meta
│     │     │        ├─ 00000207.meta
│     │     │        ├─ 00000208.meta
│     │     │        ├─ 00000211.sst
│     │     │        ├─ 00000212.meta
│     │     │        ├─ 00000217.sst
│     │     │        ├─ 00000218.meta
│     │     │        ├─ 00000223.sst
│     │     │        ├─ 00000224.meta
│     │     │        ├─ 00000229.sst
│     │     │        ├─ 00000230.meta
│     │     │        ├─ 00000235.sst
│     │     │        ├─ 00000236.sst
│     │     │        ├─ 00000237.sst
│     │     │        ├─ 00000238.meta
│     │     │        ├─ 00000239.meta
│     │     │        ├─ 00000240.meta
│     │     │        ├─ 00000245.sst
│     │     │        ├─ 00000246.meta
│     │     │        ├─ 00000251.sst
│     │     │        ├─ 00000252.meta
│     │     │        ├─ 00000257.sst
│     │     │        ├─ 00000258.sst
│     │     │        ├─ 00000259.sst
│     │     │        ├─ 00000260.meta
│     │     │        ├─ 00000261.meta
│     │     │        ├─ 00000262.meta
│     │     │        ├─ 00000267.sst
│     │     │        ├─ 00000268.sst
│     │     │        ├─ 00000269.sst
│     │     │        ├─ 00000270.meta
│     │     │        ├─ 00000273.meta
│     │     │        ├─ 00000274.meta
│     │     │        ├─ 00000277.sst
│     │     │        ├─ 00000278.meta
│     │     │        ├─ 00000283.sst
│     │     │        ├─ 00000284.meta
│     │     │        ├─ 00000289.sst
│     │     │        ├─ 00000290.meta
│     │     │        ├─ 00000295.sst
│     │     │        ├─ 00000296.meta
│     │     │        ├─ 00000301.sst
│     │     │        ├─ 00000302.sst
│     │     │        ├─ 00000303.sst
│     │     │        ├─ 00000304.meta
│     │     │        ├─ 00000307.meta
│     │     │        ├─ 00000308.meta
│     │     │        ├─ 00000315.sst
│     │     │        ├─ 00000316.sst
│     │     │        ├─ 00000317.sst
│     │     │        ├─ 00000318.meta
│     │     │        ├─ 00000319.meta
│     │     │        ├─ 00000322.meta
│     │     │        ├─ 00000325.sst
│     │     │        ├─ 00000326.meta
│     │     │        ├─ 00000331.sst
│     │     │        ├─ 00000332.meta
│     │     │        ├─ 00000337.sst
│     │     │        ├─ 00000338.meta
│     │     │        ├─ 00000343.sst
│     │     │        ├─ 00000344.meta
│     │     │        ├─ 00000349.sst
│     │     │        ├─ 00000350.sst
│     │     │        ├─ 00000351.sst
│     │     │        ├─ 00000352.meta
│     │     │        ├─ 00000353.meta
│     │     │        ├─ 00000355.meta
│     │     │        ├─ 00000359.sst
│     │     │        ├─ 00000360.meta
│     │     │        ├─ 00000365.sst
│     │     │        ├─ 00000366.meta
│     │     │        ├─ 00000371.sst
│     │     │        ├─ 00000372.meta
│     │     │        ├─ 00000377.sst
│     │     │        ├─ 00000378.meta
│     │     │        ├─ 00000383.sst
│     │     │        ├─ 00000384.meta
│     │     │        ├─ 00000389.sst
│     │     │        ├─ 00000390.meta
│     │     │        ├─ 00000395.sst
│     │     │        ├─ 00000396.sst
│     │     │        ├─ 00000397.sst
│     │     │        ├─ 00000398.meta
│     │     │        ├─ 00000401.meta
│     │     │        ├─ 00000402.meta
│     │     │        ├─ 00000403.sst
│     │     │        ├─ 00000404.sst
│     │     │        ├─ 00000405.meta
│     │     │        ├─ 00000407.sst
│     │     │        ├─ 00000409.sst
│     │     │        ├─ 00000410.meta
│     │     │        ├─ 00000411.meta
│     │     │        ├─ 00000413.sst
│     │     │        ├─ 00000415.sst
│     │     │        ├─ 00000416.sst
│     │     │        ├─ 00000417.sst
│     │     │        ├─ 00000418.meta
│     │     │        ├─ 00000420.meta
│     │     │        ├─ 00000421.meta
│     │     │        ├─ 00000422.meta
│     │     │        ├─ 00000423.sst
│     │     │        ├─ 00000425.sst
│     │     │        ├─ 00000426.meta
│     │     │        ├─ 00000428.meta
│     │     │        ├─ 00000430.sst
│     │     │        ├─ 00000431.sst
│     │     │        ├─ 00000432.meta
│     │     │        ├─ 00000433.meta
│     │     │        ├─ 00000435.sst
│     │     │        ├─ 00000437.sst
│     │     │        ├─ 00000438.meta
│     │     │        ├─ 00000440.meta
│     │     │        ├─ 00000442.sst
│     │     │        ├─ 00000443.sst
│     │     │        ├─ 00000444.meta
│     │     │        ├─ 00000445.meta
│     │     │        ├─ 00000447.sst
│     │     │        ├─ 00000449.sst
│     │     │        ├─ 00000450.meta
│     │     │        ├─ 00000451.meta
│     │     │        ├─ 00000453.sst
│     │     │        ├─ 00000455.sst
│     │     │        ├─ 00000456.meta
│     │     │        ├─ 00000457.meta
│     │     │        ├─ 00000459.sst
│     │     │        ├─ 00000461.sst
│     │     │        ├─ 00000462.meta
│     │     │        ├─ 00000463.meta
│     │     │        ├─ 00000465.sst
│     │     │        ├─ 00000467.sst
│     │     │        ├─ 00000468.sst
│     │     │        ├─ 00000469.sst
│     │     │        ├─ 00000470.meta
│     │     │        ├─ 00000471.meta
│     │     │        ├─ 00000472.meta
│     │     │        ├─ 00000474.meta
│     │     │        ├─ 00000475.sst
│     │     │        ├─ 00000476.sst
│     │     │        ├─ 00000477.meta
│     │     │        ├─ 00000479.sst
│     │     │        ├─ 00000480.sst
│     │     │        ├─ 00000481.sst
│     │     │        ├─ 00000482.meta
│     │     │        ├─ 00000483.meta
│     │     │        ├─ 00000484.meta
│     │     │        ├─ 00000485.sst
│     │     │        ├─ 00000486.sst
│     │     │        ├─ 00000487.sst
│     │     │        ├─ 00000488.meta
│     │     │        ├─ 00000489.meta
│     │     │        ├─ 00000490.meta
│     │     │        ├─ 00000491.sst
│     │     │        ├─ 00000492.sst
│     │     │        ├─ 00000493.sst
│     │     │        ├─ 00000494.sst
│     │     │        ├─ 00000495.sst
│     │     │        ├─ 00000496.meta
│     │     │        ├─ 00000497.meta
│     │     │        ├─ 00000498.meta
│     │     │        ├─ 00000499.meta
│     │     │        ├─ 00000500.meta
│     │     │        ├─ 00000501.sst
│     │     │        ├─ 00000502.sst
│     │     │        ├─ 00000503.sst
│     │     │        ├─ 00000504.meta
│     │     │        ├─ 00000505.meta
│     │     │        ├─ 00000506.meta
│     │     │        ├─ 00000507.sst
│     │     │        ├─ 00000508.sst
│     │     │        ├─ 00000509.sst
│     │     │        ├─ 00000510.meta
│     │     │        ├─ 00000511.meta
│     │     │        ├─ 00000512.meta
│     │     │        ├─ 00000513.sst
│     │     │        ├─ 00000514.sst
│     │     │        ├─ 00000515.sst
│     │     │        ├─ 00000516.meta
│     │     │        ├─ 00000517.meta
│     │     │        ├─ 00000518.meta
│     │     │        ├─ 00000519.sst
│     │     │        ├─ 00000520.sst
│     │     │        ├─ 00000521.sst
│     │     │        ├─ 00000522.meta
│     │     │        ├─ 00000523.meta
│     │     │        ├─ 00000524.meta
│     │     │        ├─ 00000525.sst
│     │     │        ├─ 00000526.sst
│     │     │        ├─ 00000527.sst
│     │     │        ├─ 00000528.meta
│     │     │        ├─ 00000529.meta
│     │     │        ├─ 00000530.meta
│     │     │        ├─ 00000531.sst
│     │     │        ├─ 00000532.sst
│     │     │        ├─ 00000533.sst
│     │     │        ├─ 00000534.meta
│     │     │        ├─ 00000535.meta
│     │     │        ├─ 00000536.meta
│     │     │        ├─ 00000537.sst
│     │     │        ├─ 00000538.sst
│     │     │        ├─ 00000539.sst
│     │     │        ├─ 00000540.meta
│     │     │        ├─ 00000541.meta
│     │     │        ├─ 00000542.meta
│     │     │        ├─ 00000543.sst
│     │     │        ├─ 00000544.sst
│     │     │        ├─ 00000545.sst
│     │     │        ├─ 00000546.meta
│     │     │        ├─ 00000547.meta
│     │     │        ├─ 00000548.meta
│     │     │        ├─ 00000549.sst
│     │     │        ├─ 00000550.sst
│     │     │        ├─ 00000551.sst
│     │     │        ├─ 00000552.meta
│     │     │        ├─ 00000553.meta
│     │     │        ├─ 00000554.meta
│     │     │        ├─ 00000555.sst
│     │     │        ├─ 00000556.sst
│     │     │        ├─ 00000557.sst
│     │     │        ├─ 00000558.meta
│     │     │        ├─ 00000559.meta
│     │     │        ├─ 00000560.meta
│     │     │        ├─ 00000561.sst
│     │     │        ├─ 00000562.sst
│     │     │        ├─ 00000563.sst
│     │     │        ├─ 00000564.meta
│     │     │        ├─ 00000565.meta
│     │     │        ├─ 00000566.meta
│     │     │        ├─ 00000567.sst
│     │     │        ├─ 00000568.sst
│     │     │        ├─ 00000569.sst
│     │     │        ├─ 00000570.meta
│     │     │        ├─ 00000571.meta
│     │     │        ├─ 00000572.meta
│     │     │        ├─ 00000573.sst
│     │     │        ├─ 00000574.sst
│     │     │        ├─ 00000575.sst
│     │     │        ├─ 00000576.meta
│     │     │        ├─ 00000577.meta
│     │     │        ├─ 00000578.meta
│     │     │        ├─ 00000579.sst
│     │     │        ├─ 00000580.sst
│     │     │        ├─ 00000581.sst
│     │     │        ├─ 00000582.meta
│     │     │        ├─ 00000583.meta
│     │     │        ├─ 00000584.meta
│     │     │        ├─ 00000585.sst
│     │     │        ├─ 00000586.sst
│     │     │        ├─ 00000587.sst
│     │     │        ├─ 00000588.sst
│     │     │        ├─ 00000589.sst
│     │     │        ├─ 00000590.meta
│     │     │        ├─ 00000591.meta
│     │     │        ├─ 00000592.meta
│     │     │        ├─ 00000593.meta
│     │     │        ├─ 00000594.meta
│     │     │        ├─ 00000595.sst
│     │     │        ├─ 00000596.sst
│     │     │        ├─ 00000597.sst
│     │     │        ├─ 00000598.meta
│     │     │        ├─ 00000599.meta
│     │     │        ├─ 00000600.meta
│     │     │        ├─ CURRENT
│     │     │        └─ LOG
│     │     ├─ fallback-build-manifest.json
│     │     ├─ logs
│     │     │  └─ next-development.log
│     │     ├─ package.json
│     │     ├─ prerender-manifest.json
│     │     ├─ routes-manifest.json
│     │     ├─ server
│     │     │  ├─ app
│     │     │  │  ├─ (auth)
│     │     │  │  │  ├─ forgot-password
│     │     │  │  │  │  ├─ page
│     │     │  │  │  │  │  ├─ app-paths-manifest.json
│     │     │  │  │  │  │  ├─ build-manifest.json
│     │     │  │  │  │  │  ├─ next-font-manifest.json
│     │     │  │  │  │  │  ├─ react-loadable-manifest.json
│     │     │  │  │  │  │  └─ server-reference-manifest.json
│     │     │  │  │  │  ├─ page.js
│     │     │  │  │  │  ├─ page.js.map
│     │     │  │  │  │  └─ page_client-reference-manifest.js
│     │     │  │  │  ├─ login
│     │     │  │  │  │  ├─ page
│     │     │  │  │  │  │  ├─ app-paths-manifest.json
│     │     │  │  │  │  │  ├─ build-manifest.json
│     │     │  │  │  │  │  ├─ next-font-manifest.json
│     │     │  │  │  │  │  ├─ react-loadable-manifest.json
│     │     │  │  │  │  │  └─ server-reference-manifest.json
│     │     │  │  │  │  ├─ page.js
│     │     │  │  │  │  ├─ page.js.map
│     │     │  │  │  │  └─ page_client-reference-manifest.js
│     │     │  │  │  └─ register
│     │     │  │  │     ├─ page
│     │     │  │  │     │  ├─ app-paths-manifest.json
│     │     │  │  │     │  ├─ build-manifest.json
│     │     │  │  │     │  ├─ next-font-manifest.json
│     │     │  │  │     │  ├─ react-loadable-manifest.json
│     │     │  │  │     │  └─ server-reference-manifest.json
│     │     │  │  │     ├─ page.js
│     │     │  │  │     ├─ page.js.map
│     │     │  │  │     └─ page_client-reference-manifest.js
│     │     │  │  ├─ page
│     │     │  │  │  ├─ app-paths-manifest.json
│     │     │  │  │  ├─ build-manifest.json
│     │     │  │  │  ├─ next-font-manifest.json
│     │     │  │  │  ├─ react-loadable-manifest.json
│     │     │  │  │  └─ server-reference-manifest.json
│     │     │  │  ├─ page.js
│     │     │  │  ├─ page.js.map
│     │     │  │  ├─ page_client-reference-manifest.js
│     │     │  │  └─ scan
│     │     │  │     ├─ page
│     │     │  │     │  ├─ app-paths-manifest.json
│     │     │  │     │  ├─ build-manifest.json
│     │     │  │     │  ├─ next-font-manifest.json
│     │     │  │     │  ├─ react-loadable-manifest.json
│     │     │  │     │  └─ server-reference-manifest.json
│     │     │  │     ├─ page.js
│     │     │  │     ├─ page.js.map
│     │     │  │     └─ page_client-reference-manifest.js
│     │     │  ├─ app-paths-manifest.json
│     │     │  ├─ chunks
│     │     │  │  └─ ssr
│     │     │  │     ├─ 031b8_framer-motion_dist_es_6698028c._.js
│     │     │  │     ├─ 031b8_framer-motion_dist_es_6698028c._.js.map
│     │     │  │     ├─ 031b8_framer-motion_dist_es_e5dc4058._.js
│     │     │  │     ├─ 031b8_framer-motion_dist_es_e5dc4058._.js.map
│     │     │  │     ├─ 518ff_zod_b6a19e1a._.js
│     │     │  │     ├─ 518ff_zod_b6a19e1a._.js.map
│     │     │  │     ├─ 69652_@swc_helpers_cjs__interop_require_wildcard_cjs_f6d64c6c._.js
│     │     │  │     ├─ 69652_@swc_helpers_cjs__interop_require_wildcard_cjs_f6d64c6c._.js.map
│     │     │  │     ├─ a8d7e_zod_de437a57._.js
│     │     │  │     ├─ a8d7e_zod_de437a57._.js.map
│     │     │  │     ├─ apps_web_src_app_(auth)_layout_tsx_c4363903._.js
│     │     │  │     ├─ apps_web_src_app_(auth)_layout_tsx_c4363903._.js.map
│     │     │  │     ├─ apps_web_src_app_dd37023f._.js
│     │     │  │     ├─ apps_web_src_app_dd37023f._.js.map
│     │     │  │     ├─ apps_web__next-internal_server_app_(auth)_forgot-password_page_actions_ce3184dd.js
│     │     │  │     ├─ apps_web__next-internal_server_app_(auth)_forgot-password_page_actions_ce3184dd.js.map
│     │     │  │     ├─ apps_web__next-internal_server_app_(auth)_login_page_actions_52328be4.js
│     │     │  │     ├─ apps_web__next-internal_server_app_(auth)_login_page_actions_52328be4.js.map
│     │     │  │     ├─ apps_web__next-internal_server_app_(auth)_register_page_actions_ace1e230.js
│     │     │  │     ├─ apps_web__next-internal_server_app_(auth)_register_page_actions_ace1e230.js.map
│     │     │  │     ├─ apps_web__next-internal_server_app_page_actions_a0623280.js
│     │     │  │     ├─ apps_web__next-internal_server_app_page_actions_a0623280.js.map
│     │     │  │     ├─ apps_web__next-internal_server_app_scan_page_actions_2637008f.js
│     │     │  │     ├─ apps_web__next-internal_server_app_scan_page_actions_2637008f.js.map
│     │     │  │     ├─ bf1cb_next_dist_0dd01496._.js
│     │     │  │     ├─ bf1cb_next_dist_0dd01496._.js.map
│     │     │  │     ├─ bf1cb_next_dist_48e0c8a8._.js
│     │     │  │     ├─ bf1cb_next_dist_48e0c8a8._.js.map
│     │     │  │     ├─ bf1cb_next_dist_5c12525b._.js
│     │     │  │     ├─ bf1cb_next_dist_5c12525b._.js.map
│     │     │  │     ├─ bf1cb_next_dist_6f3114ce._.js
│     │     │  │     ├─ bf1cb_next_dist_6f3114ce._.js.map
│     │     │  │     ├─ bf1cb_next_dist_8e849371._.js
│     │     │  │     ├─ bf1cb_next_dist_8e849371._.js.map
│     │     │  │     ├─ bf1cb_next_dist_client_components_82ad27ed._.js
│     │     │  │     ├─ bf1cb_next_dist_client_components_82ad27ed._.js.map
│     │     │  │     ├─ bf1cb_next_dist_client_components_builtin_forbidden_72e7611f.js
│     │     │  │     ├─ bf1cb_next_dist_client_components_builtin_forbidden_72e7611f.js.map
│     │     │  │     ├─ bf1cb_next_dist_client_components_builtin_global-error_61feee31.js
│     │     │  │     ├─ bf1cb_next_dist_client_components_builtin_global-error_61feee31.js.map
│     │     │  │     ├─ bf1cb_next_dist_client_components_builtin_unauthorized_e01ba0a4.js
│     │     │  │     ├─ bf1cb_next_dist_client_components_builtin_unauthorized_e01ba0a4.js.map
│     │     │  │     ├─ bf1cb_next_dist_compiled_f81abf01._.js
│     │     │  │     ├─ bf1cb_next_dist_compiled_f81abf01._.js.map
│     │     │  │     ├─ bf1cb_next_dist_eda86705._.js
│     │     │  │     ├─ bf1cb_next_dist_eda86705._.js.map
│     │     │  │     ├─ bf1cb_next_dist_esm_d93c775b._.js
│     │     │  │     ├─ bf1cb_next_dist_esm_d93c775b._.js.map
│     │     │  │     ├─ bf1cb_next_dist_f4a7fdf2._.js
│     │     │  │     ├─ bf1cb_next_dist_f4a7fdf2._.js.map
│     │     │  │     ├─ [externals]_next_dist_c80f7c8f._.js
│     │     │  │     ├─ [externals]_next_dist_c80f7c8f._.js.map
│     │     │  │     ├─ [externals]__e8a2741f._.js
│     │     │  │     ├─ [externals]__e8a2741f._.js.map
│     │     │  │     ├─ [root-of-the-server]__26293795._.js
│     │     │  │     ├─ [root-of-the-server]__26293795._.js.map
│     │     │  │     ├─ [root-of-the-server]__2ffd1458._.js
│     │     │  │     ├─ [root-of-the-server]__2ffd1458._.js.map
│     │     │  │     ├─ [root-of-the-server]__36867c73._.js
│     │     │  │     ├─ [root-of-the-server]__36867c73._.js.map
│     │     │  │     ├─ [root-of-the-server]__55d14e0d._.js
│     │     │  │     ├─ [root-of-the-server]__55d14e0d._.js.map
│     │     │  │     ├─ [root-of-the-server]__6172ca8a._.js
│     │     │  │     ├─ [root-of-the-server]__6172ca8a._.js.map
│     │     │  │     ├─ [root-of-the-server]__762aea7f._.js
│     │     │  │     ├─ [root-of-the-server]__762aea7f._.js.map
│     │     │  │     ├─ [root-of-the-server]__8a841bd7._.js
│     │     │  │     ├─ [root-of-the-server]__8a841bd7._.js.map
│     │     │  │     ├─ [root-of-the-server]__970544ac._.js
│     │     │  │     ├─ [root-of-the-server]__970544ac._.js.map
│     │     │  │     ├─ [root-of-the-server]__b111945a._.js
│     │     │  │     ├─ [root-of-the-server]__b111945a._.js.map
│     │     │  │     ├─ [root-of-the-server]__d935892d._.js
│     │     │  │     ├─ [root-of-the-server]__d935892d._.js.map
│     │     │  │     ├─ [root-of-the-server]__ed9df408._.js
│     │     │  │     ├─ [root-of-the-server]__ed9df408._.js.map
│     │     │  │     ├─ [root-of-the-server]__fb332392._.js
│     │     │  │     ├─ [root-of-the-server]__fb332392._.js.map
│     │     │  │     ├─ [turbopack]_runtime.js
│     │     │  │     ├─ [turbopack]_runtime.js.map
│     │     │  │     ├─ _20d89e9a._.js
│     │     │  │     ├─ _20d89e9a._.js.map
│     │     │  │     ├─ _9e1c2e13._.js
│     │     │  │     ├─ _9e1c2e13._.js.map
│     │     │  │     ├─ _bed61e68._.js
│     │     │  │     └─ _bed61e68._.js.map
│     │     │  ├─ interception-route-rewrite-manifest.js
│     │     │  ├─ middleware-build-manifest.js
│     │     │  ├─ middleware-manifest.json
│     │     │  ├─ next-font-manifest.js
│     │     │  ├─ next-font-manifest.json
│     │     │  ├─ pages-manifest.json
│     │     │  ├─ server-reference-manifest.js
│     │     │  └─ server-reference-manifest.json
│     │     ├─ static
│     │     │  ├─ chunks
│     │     │  │  ├─ 031b8_framer-motion_dist_es_6661a5a2._.js
│     │     │  │  ├─ 031b8_framer-motion_dist_es_6661a5a2._.js.map
│     │     │  │  ├─ 031b8_framer-motion_dist_es_f7893d6c._.js
│     │     │  │  ├─ 031b8_framer-motion_dist_es_f7893d6c._.js.map
│     │     │  │  ├─ 518ff_zod_4685daa8._.js
│     │     │  │  ├─ 518ff_zod_4685daa8._.js.map
│     │     │  │  ├─ 69652_@swc_helpers_cjs_679851cc._.js
│     │     │  │  ├─ 69652_@swc_helpers_cjs_679851cc._.js.map
│     │     │  │  ├─ 85c95_react-hook-form_dist_index_esm_mjs_76afa9ea._.js
│     │     │  │  ├─ 85c95_react-hook-form_dist_index_esm_mjs_76afa9ea._.js.map
│     │     │  │  ├─ a8d7e_zod_8659f7bd._.js
│     │     │  │  ├─ a8d7e_zod_8659f7bd._.js.map
│     │     │  │  ├─ apps_web_a0ff3932._.js
│     │     │  │  ├─ apps_web_d2be9d48._.js.map
│     │     │  │  ├─ apps_web_src_app_(auth)_forgot-password_page_tsx_1c1f2ae1._.js
│     │     │  │  ├─ apps_web_src_app_(auth)_login_page_tsx_1c1f2ae1._.js
│     │     │  │  ├─ apps_web_src_app_(auth)_register_page_tsx_1c1f2ae1._.js
│     │     │  │  ├─ apps_web_src_app_favicon_ico_mjs_8d13e521._.js
│     │     │  │  ├─ apps_web_src_app_globals_css_bad6b30c._.single.css
│     │     │  │  ├─ apps_web_src_app_globals_css_bad6b30c._.single.css.map
│     │     │  │  ├─ apps_web_src_app_layout_tsx_503d359e._.js
│     │     │  │  ├─ apps_web_src_app_page_tsx_1c1f2ae1._.js
│     │     │  │  ├─ apps_web_src_app_scan_page_tsx_1c1f2ae1._.js
│     │     │  │  ├─ bf1cb_next_dist_1799a1ed._.js
│     │     │  │  ├─ bf1cb_next_dist_1799a1ed._.js.map
│     │     │  │  ├─ bf1cb_next_dist_93134f3b._.js
│     │     │  │  ├─ bf1cb_next_dist_93134f3b._.js.map
│     │     │  │  ├─ bf1cb_next_dist_build_polyfills_polyfill-nomodule.js
│     │     │  │  ├─ bf1cb_next_dist_build_polyfills_polyfill-nomodule.js.map
│     │     │  │  ├─ bf1cb_next_dist_client_4a8fd060._.js
│     │     │  │  ├─ bf1cb_next_dist_client_4a8fd060._.js.map
│     │     │  │  ├─ bf1cb_next_dist_client_components_builtin_global-error_503d359e.js
│     │     │  │  ├─ bf1cb_next_dist_compiled_29eb2182._.js
│     │     │  │  ├─ bf1cb_next_dist_compiled_29eb2182._.js.map
│     │     │  │  ├─ bf1cb_next_dist_compiled_next-devtools_index_d4fb9a69.js
│     │     │  │  ├─ bf1cb_next_dist_compiled_next-devtools_index_d4fb9a69.js.map
│     │     │  │  ├─ bf1cb_next_dist_compiled_react-dom_34cfa815._.js
│     │     │  │  ├─ bf1cb_next_dist_compiled_react-dom_34cfa815._.js.map
│     │     │  │  ├─ bf1cb_next_dist_compiled_react-server-dom-turbopack_7ab10b34._.js
│     │     │  │  ├─ bf1cb_next_dist_compiled_react-server-dom-turbopack_7ab10b34._.js.map
│     │     │  │  ├─ turbopack-apps_web_d2be9d48._.js
│     │     │  │  ├─ [next]_internal_font_google_geist_a71539c9_module_css_bad6b30c._.single.css
│     │     │  │  ├─ [next]_internal_font_google_geist_a71539c9_module_css_bad6b30c._.single.css.map
│     │     │  │  ├─ [next]_internal_font_google_geist_mono_8d43a2aa_module_css_bad6b30c._.single.css
│     │     │  │  ├─ [next]_internal_font_google_geist_mono_8d43a2aa_module_css_bad6b30c._.single.css.map
│     │     │  │  ├─ [root-of-the-server]__5bf117b1._.css
│     │     │  │  ├─ [root-of-the-server]__5bf117b1._.css.map
│     │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_336ef60f._.js
│     │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_77874dfc._.js
│     │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_77874dfc._.js.map
│     │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js
│     │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js.map
│     │     │  │  ├─ _3b6c2de9._.js
│     │     │  │  ├─ _3b6c2de9._.js.map
│     │     │  │  ├─ _492be555._.js
│     │     │  │  ├─ _492be555._.js.map
│     │     │  │  ├─ _752d478f._.js
│     │     │  │  ├─ _752d478f._.js.map
│     │     │  │  ├─ _df8ae2da._.js
│     │     │  │  ├─ _df8ae2da._.js.map
│     │     │  │  ├─ _e19c2fea._.js
│     │     │  │  └─ _e19c2fea._.js.map
│     │     │  ├─ development
│     │     │  │  ├─ _buildManifest.js
│     │     │  │  ├─ _clientMiddlewareManifest.json
│     │     │  │  └─ _ssgManifest.js
│     │     │  └─ media
│     │     │     ├─ 4fa387ec64143e14-s.c1fdd6c2.woff2
│     │     │     ├─ 7178b3e590c64307-s.b97b3418.woff2
│     │     │     ├─ 797e433ab948586e-s.p.dbea232f.woff2
│     │     │     ├─ 8a480f0b521d4e75-s.8e0177b5.woff2
│     │     │     ├─ bbc41e54d2fcbd21-s.799d8ef8.woff2
│     │     │     ├─ caa3a2e1cccd8315-s.p.853070df.woff2
│     │     │     └─ favicon.0b3bf435.ico
│     │     ├─ trace
│     │     └─ types
│     │        ├─ cache-life.d.ts
│     │        ├─ routes.d.ts
│     │        └─ validator.ts
│     ├─ eslint.config.mjs
│     ├─ next-env.d.ts
│     ├─ next.config.ts
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ public
│     │  ├─ file.svg
│     │  ├─ globe.svg
│     │  ├─ next.svg
│     │  ├─ vercel.svg
│     │  └─ window.svg
│     ├─ README.md
│     ├─ src
│     │  ├─ app
│     │  │  ├─ (auth)
│     │  │  │  ├─ forgot-password
│     │  │  │  │  └─ page.tsx
│     │  │  │  ├─ layout.tsx
│     │  │  │  ├─ login
│     │  │  │  │  └─ page.tsx
│     │  │  │  └─ register
│     │  │  │     └─ page.tsx
│     │  │  ├─ favicon.ico
│     │  │  ├─ globals.css
│     │  │  ├─ layout.tsx
│     │  │  ├─ page.tsx
│     │  │  ├─ privacy
│     │  │  │  └─ page.tsx
│     │  │  ├─ providers.tsx
│     │  │  ├─ scan
│     │  │  │  └─ page.tsx
│     │  │  └─ terms
│     │  │     └─ page.tsx
│     │  ├─ components
│     │  │  ├─ auth
│     │  │  │  ├─ ForgotPasswordForm.tsx
│     │  │  │  ├─ index.ts
│     │  │  │  ├─ LoginForm.tsx
│     │  │  │  └─ RegisterForm.tsx
│     │  │  ├─ common
│     │  │  │  ├─ Button.tsx
│     │  │  │  ├─ Card.tsx
│     │  │  │  ├─ index.ts
│     │  │  │  └─ Input.tsx
│     │  │  ├─ index.ts
│     │  │  ├─ landing
│     │  │  │  ├─ FeatureCard.tsx
│     │  │  │  ├─ FeaturesSection.tsx
│     │  │  │  ├─ FloatingCards.tsx
│     │  │  │  ├─ HeroSection.tsx
│     │  │  │  ├─ HeroStats.tsx
│     │  │  │  └─ index.ts
│     │  │  ├─ LandingPage.tsx
│     │  │  ├─ layout
│     │  │  │  ├─ Footer.tsx
│     │  │  │  ├─ Header.tsx
│     │  │  │  ├─ index.ts
│     │  │  │  └─ Navbar.tsx
│     │  │  └─ Scanner.tsx
│     │  ├─ hooks
│     │  │  ├─ index.ts
│     │  │  ├─ useAuth.ts
│     │  │  └─ useScan.ts
│     │  ├─ lib
│     │  │  ├─ api-client.ts
│     │  │  ├─ index.ts
│     │  │  └─ utils.ts
│     │  └─ services
│     │     ├─ auth.service.ts
│     │     ├─ disease.service.ts
│     │     ├─ index.ts
│     │     ├─ plant.service.ts
│     │     └─ scan.service.ts
│     └─ tsconfig.json
├─ DOC
│  └─ README.md
├─ infra
│  └─ docker-compose
│     └─ docker-compose.yml
├─ package-lock.json
├─ package.json
├─ packages
│  ├─ database
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ index.ts
│  │  │  └─ schemas
│  │  │     ├─ disease.schema.ts
│  │  │     ├─ plant.schema.ts
│  │  │     ├─ scan-history.schema.ts
│  │  │     └─ user.schema.ts
│  │  └─ tsconfig.json
│  ├─ shared
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ constants
│  │  │  │  ├─ api.constants.ts
│  │  │  │  ├─ app.constants.ts
│  │  │  │  └─ index.ts
│  │  │  ├─ index.ts
│  │  │  ├─ schemas
│  │  │  │  ├─ auth.schema.ts
│  │  │  │  └─ index.ts
│  │  │  ├─ types
│  │  │  │  ├─ api.types.ts
│  │  │  │  ├─ disease.types.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ plant.types.ts
│  │  │  │  ├─ scan-history.types.ts
│  │  │  │  └─ user.types.ts
│  │  │  └─ utils
│  │  │     ├─ cn.utils.ts
│  │  │     ├─ format.utils.ts
│  │  │     ├─ index.ts
│  │  │     └─ validation.utils.ts
│  │  └─ tsconfig.json
│  └─ tsconfig
│     ├─ package.json
│     └─ tsconfig.base.json
├─ pnpm-lock.yaml
└─ pnpm-workspace.yaml

```