# Delorean Design System (fuente única de verdad visual)

Base: "Floating shopping constellation on white marble" (styles.refero.design) + scroll-reveal e hover inmersivo estilo Rockstar Games (GTA VI).

## Superficies
- Canvas `#F8F9FA`
- Tarjetas flotantes `#FFFFFF`
- Bordes hairline `1px solid rgba(0,0,0,0.06)`
- Texto `#111111` (negro carbón)

## Color de marca
- Acento único: Naranja Delorean `#FF6B00` (reemplaza `#5433eb`): botón circular de búsqueda, estados activos.
- Sombra tintada: `0 10px 25px -5px rgba(255,107,0,0.4)`
- Amarillo Rayo `#FFD600`: exclusivo del logo bitono y Delorean Rewards.

## Geometría y tipografía
- Radios pillow-soft 20–28px (`rounded-[24px]`) en cards y modales.
- Controles y tallas (`S | M | L | XL`) en pill (`rounded-full`).
- Cuerpo 16px, `tracking-[-0.02em]`; títulos `tracking-[-0.04em]`.
- Grilla `gap-3` (12px); ritmo vertical `py-16` a `py-20` (64–80px).

## Motion
- Hover en cards: elevación suave + `scale-[1.03]`, `duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`.
- Scroll-reveal en secciones y cards.
