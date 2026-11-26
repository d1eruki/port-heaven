# Repository Instructions

## Port Heaven Frontend Conventions

Keep capability causes such as `hw/no-hw` and `motion/reduced-motion` separate, but make effect-dependent components consume the resolved `effects/no-effects` state. Keep behavior under `no-effects` identical whether it comes from reduced motion, manual mode, or capability fallback unless a difference is explicitly required and documented.

Create a component without asking only for a large semantic page section or an established reusable block. If a repeated block appears suitable for extraction, ask the user before introducing the component.

Before adding or changing component-specific custom CSS, list every affected selector, explain why Tailwind cannot express the result, and request explicit approval. Report the changed selectors after implementation. Write interface toggle labels in full and lowercase as the action or alternative state applied after activation.

## Порядок слияния веток

- Веди каждую фичу в одной рабочей ветке. Фиксы и доработки этой фичи добавляй в неё же. После слияния сохраняй ветку на последнем коммите этой фичи. Общие исправления, в том числе правки CI, делай в соответствующей ветке итерации `*/main`.
- Сначала вливай рабочую ветку в подходящую ветку итерации `*/main`. Для выпуска вливай в `master` изменения из этой же ветки `*/main`.
