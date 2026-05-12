# Rediseño Visual Funcional (Minimal Oscuro) + Layout Nuevo

## Contexto

El proyecto es un editor tipo DCC/3D construido con Vue 3 + TypeScript (Vite) y Tailwind CSS v4. La interfaz actual es una SPA sin enrutador y se compone principalmente de un layout con paneles (split panes) y un viewport 3D (BabylonJS).

La estrategia de estilos se basa en utilidades Tailwind más un set de variables CSS (tokens) en `src/style.css`, con clases semánticas tipo `bg-editor-*`, `text-editor-*`, etc.

## Objetivos

- Rediseñar visualmente la app completa con un estilo minimalista oscuro, legible y de densidad cómoda.
- Introducir un layout nuevo (reorganización funcional de paneles y chrome del editor) manteniendo la app como SPA.
- Implementar tema oscuro + tema claro usando el mismo set de tokens semánticos para minimizar cambios por componente.
- Estandarizar estados interactivos (hover/active/focus), tipografía, espaciados y superficies para coherencia global.

## No Objetivos

- No cambiar el motor 3D, ni la lógica de escena/selección/gizmos.
- No rediseñar el flujo de datos del editor ni los stores (salvo lo necesario para soporte de tema/layout).
- No introducir nuevas pantallas complejas (Project Manager, Settings app) en esta fase.

## Principios De Diseño

- Productividad primero: el viewport sigue siendo la zona de mayor jerarquía.
- “Chrome” consistente: paneles, headers, toolbars, inputs y listas deben sentirse parte del mismo sistema.
- Legibilidad prolongada: contraste correcto, tipografía clara, targets de click amplios.
- Accesibilidad: foco visible consistente y navegación por teclado razonable.

## Sistema De Diseño (Mínimo)

### Tokens

Se mantiene el modelo de variables CSS, pero se separa en:

- Tokens base (paleta): neutrales, acento, estados.
- Tokens semánticos (uso): `--surface-*`, `--text-*`, `--border-*`, `--interactive-*`, `--focus-*`.

Se implementan dos temas que asignan los tokens base a los tokens semánticos:

- `data-theme="dark"`
- `data-theme="light"`

### Tipografía Y Densidad

Densidad cómoda:

- Tamaños objetivo: `text-sm` como base, `text-xs` solo para metadata; evitar tamaños arbitrarios.
- Altura de fila y padding generosos en listas e inputs (click targets más amplios).
- Jerarquía clara: títulos de panel, labels y valores diferenciados.

### Interacción (Hover/Active/Focus)

- Hover y active con micro-contraste (sin ruido visual).
- Foco visible con ring consistente (no solo cambio de borde).
- Estados deshabilitados con contraste suficiente y sin perder legibilidad.

## Componentes Base (UI Primitiva)

Crear una capa mínima de componentes reutilizables para reemplazar patrones repetidos en paneles y toolbars:

- `UiPanel` / `UiPanelHeader`
- `UiButton` / `UiIconButton`
- `UiInput` (text) y `UiNumberInput` (envolviendo el componente existente si aplica)
- `UiSelect` (si existe patrón repetido)
- `UiTabs` (para Assets/Console)
- `UiSection` (para Inspector: header + contenido colapsable)

La intención es que el rediseño futuro se haga tocando tokens + primitivos, no re-estilando cada panel manualmente.

## Layout Nuevo (Estructura)

### Estructura General

- **Barra superior**: toolbar más clara, con acciones principales e indicadores de estado.
- **Centro**: viewport como contenido primario con chrome mínimo alrededor.
- **Izquierda**: jerarquía (Hierarchy) con búsqueda y acciones contextualizadas.
- **Derecha**: inspector con secciones colapsables y controles uniformes.
- **Abajo**: región con tabs para Assets y Console.

### Reglas De Layout

- El viewport mantiene el mayor peso visual.
- Los paneles laterales priorizan legibilidad (scroll, padding y títulos consistentes).
- El área inferior no debe competir visualmente con el viewport (superficie más discreta).

## Estrategia De Migración

1. Introducir tokens semánticos y soporte de tema oscuro/claro (sin cambiar layout todavía).
2. Crear UI primitiva (Panel/Header/Button/Input/Tabs) y migrar Toolbar/StatusBar a estos primitivos.
3. Replantear `EditorLayout` para el layout nuevo, manteniendo los paneles actuales como contenido.
4. Migrar paneles (Hierarchy/Inspector/Assets/Console) al chrome nuevo (headers, listas, inputs).
5. Ajustes finos: spacing, tipografía, estados interactivos y accesibilidad.

## Criterios De Aceptación

- La app compila y funciona con el mismo set de features actuales.
- Tema oscuro y tema claro funcionan con el mismo layout y componentes.
- Estados hover/active/focus son consistentes en toolbar, paneles e inputs.
- El layout nuevo mantiene viewport como foco principal y los paneles son cómodos de leer.

## Validación De UI

Al finalizar la implementación, se realiza una revisión de consistencia visual y accesibilidad (contraste, foco visible, jerarquía tipográfica y densidad) con una guía de buenas prácticas de UI para detectar regresiones y puntos débiles del rediseño.

