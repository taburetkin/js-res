### ⚠️ Polymorphism & Method Overriding (The `this` Context Caveat)

Our API architecture relies on dynamic context switching to preserve custom class instances across method chains. Because of this, the `this` context points to different objects depending on where the execution is:
1. **Factories (`OK`, `ERR`, `RES`, `create`)** run in the context of the **`Results`** singleton instance.
2. **Chain Methods (`map`, `mapAsync`, `await`)** run in the context of the **`Result`** class instance itself.

If you override utility methods like `safeInvoke`, `normalizeOptions`, or `normalizeArgs`, **you MUST define them on BOTH classes** to ensure consistency across the entire execution lifecycle.

#### 💡 Correct Implementation Example:

```javascript
import { Results, Result } from 'your-library';

// 1. Create your custom Result class and mirror the custom utilities here
class MyResult extends Result {
  safeInvoke(fn, options) {
    // Custom invocation logic for method chains (e.g., .map())
  }
}

// 2. Create your custom Results factory and define the utilities here too
class MyResults extends Results {
  Class = MyResult;

  safeInvoke(fn, options) {
    // Custom invocation logic for initial factory calls (e.g., OK())
  }
}

export const myApi = new MyResults();
const { OK } = myApi.export();
```