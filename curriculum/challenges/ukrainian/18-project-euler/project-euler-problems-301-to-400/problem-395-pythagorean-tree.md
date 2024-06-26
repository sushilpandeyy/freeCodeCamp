---
id: 5900f4f71000cf542c51000a
title: 'Завдання 395: дерево Піфагора'
challengeType: 1
forumTopicId: 302060
dashedName: problem-395-pythagorean-tree
---

# --description--

Дерево Піфагора — це фрактал, утворений таким чином:

Почнемо з одиничного квадрата. Після цього оберемо одну зі сторін за основу (на анімації за основу взято нижню сторону):

1. Прикріпіть до протилежної основі сторони прямокутний трикутник з гіпотенузою, яка збігається з цією стороною, та зі співвідношенням сторін 3:4:5. Зверніть увагу, що менший катет трикутника має бути праворуч від основи (див. анімацію).
2. Прикріпіть квадрат до кожного катета прямокутного трикутника так, щоб одна зі сторін була дотичною з цим катетом.
3. Повторіть процедуру для обох квадратів, беручи за основи сторони, дотичні до трикутника.

Отримана фігура, після нескінченної кількості повторень, є деревом Піфагора.

<img alt="анімація з 8 повторень процедури" src="https://cdn.freecodecamp.org/curriculum/project-euler/pythagorean-tree.gif" style="background-color: white; padding: 10px; display: block; margin-right: auto; margin-left: auto; margin-bottom: 1.2rem;" />

Можна довести, що існує принаймні один прямокутник, сторони якого паралельні сторонам найбільшого квадрата дерева Піфагора, та який повністю охоплює дерево Піфагора.

Знайдіть найменшу можливу площу такого прямокутника та надайте відповідь, заокругливши до десяти знаків після коми.

# --hints--

`pythagoreanTree()` має повернути `28.2453753155`.

```js
assert.strictEqual(pythagoreanTree(), 28.2453753155);
```

# --seed--

## --seed-contents--

```js
function pythagoreanTree() {

  return true;
}

pythagoreanTree();
```

# --solutions--

```js
// solution required
```
