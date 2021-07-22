import {define, CCProps} from '../c-c.js';
import {html} from 'xtal-element/lib/html.js';
import('pass-down/p-d.js');
import('aggregator-fn/ag-fn.js');

define('counter-fa', html`
<button part=down data-d=-1>-</button>
<p-d on=click to=[-d] m=1 val=target.dataset.d parse-val-as=int></p-d>
<span part=count>{{count}}</span>
<button part=up data-d=1>+</button>
<p-d on=click to=[-d] m=1 val=target.dataset.d parse-val-as=int></p-d>
<ag-fn -d><script nomodule>
    ({d, host}) => {
        host.count += d;
    }
</script></ag-fn>
<style>
    * {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }
</style>
`, {
    numProps: ['count=30']
} as CCProps);

