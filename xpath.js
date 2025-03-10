let htmlContent = null;

async function scrape() {
    const url = document.getElementById('urlInput').value;
    const xpath = document.getElementById('xpathInput').value;
    const output = document.getElementById('output');
    const alertBox = document.getElementById('alert');

    output.innerHTML = "<span class='text-gray-400'>📞 Llamando...</span>";
    alertBox.classList.add('hidden');

    if (!url) {
        output.innerHTML = "<span class='text-red-500'>❗ Ingrese una URL válida.</span>";
        return;
    }
    if (!xpath) {
        output.innerHTML = "<span class='text-red-500'>❗ Ingrese una expresión XPath.</span>";
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al descargar el HTML: ${response.status}`);

        htmlContent = await response.text();
        alertBox.classList.remove('hidden');

        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        
        const results = [];
        const evaluator = new XPathEvaluator();
        const result = evaluator.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);

        let node = result.iterateNext();
        while (node) {
            results.push(node.outerHTML || node.textContent);
            node = result.iterateNext();
        }

        
        output.innerHTML = results.length > 0 ? results.map(r => `<p class="text-gray-700">${r}</p>`).join('') 
                                      : "<span class='text-gray-500'>❗ No se encontraron resultados.</span>";
    } catch (error) {
        output.innerHTML = `<span class='text-red-500'>❗ Error: ${error.message}</span>`;
    }
}

