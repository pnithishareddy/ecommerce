
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Cannot find <div id="root"></div> in index.html');
}

const root = ReactDOM.createRoot(rootElement);

root.render(html`<${App} />`);
