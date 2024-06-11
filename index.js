document.getElementById('invoiceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Capture form data
    const clientName = document.getElementById('clientName').value;
    const clientAdress = document.getElementById('clientAdress').value;
    const squareFootage = parseFloat(document.getElementById('squareFootage').value);
    const ppsf = parseFloat(document.getElementById('ppsf').value);
    const logoFile = document.getElementById('logo').files[0];

    // Generate PDF invoice
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add header with logo and title
    if (logoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            doc.addImage(e.target.result, 'JPEG', 150, 10, 50, 20); // Fixed size and position for the logo
            addInvoiceContent(doc);
            openPdf(doc);
        };
        reader.readAsDataURL(logoFile);
    } else {
        addInvoiceContent(doc);
        openPdf(doc);
    }

    function addInvoiceContent(doc) {
        // Add invoice title
        doc.setFontSize(20);
        doc.text("Facture", 10, 30);

        // Add client details
        doc.setFontSize(12);
        doc.text("Détails du client:", 10, 50);
        doc.line(10, 52, 200, 52); // Horizontal line
        doc.text(`Nom: ${clientName}`, 10, 60);
        doc.text(`Adresse: ${clientAdress}`, 10, 70);
        
        // Add invoice details
        doc.text("Détails de la facture:", 10, 90);
        doc.line(10, 92, 200, 92); // Horizontal line
        doc.text(`Superficie en pieds carré: ${squareFootage}`, 10, 100);
        doc.text(`Prix au pied carré: ${ppsf.toFixed(2)} $`, 10, 110);
        doc.text(`Prix total: ${(squareFootage * ppsf).toFixed(2)} $`, 10, 120);

        // Add table for services
        doc.autoTable({
            startY: 130,
            head: [['Services', 'Quantité(pi^2)', 'Prix au pied carré', 'Total']],
            body: [
                ['Hydroensemencement', squareFootage, `${ppsf.toFixed(2)} $`, `${(squareFootage * ppsf).toFixed(2)} $`],
            ],
            styles: {
                lineColor: [44, 62, 80],
                lineWidth: 0.75,
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                halign: 'center',
            },
            bodyStyles: {
                halign: 'center',
            },
            theme: 'grid',
        });

        // Add footer
        doc.setFontSize(10);
        doc.text("Thank you for your business!", 10, doc.internal.pageSize.height - 10);
    }

    function openPdf(doc) {
        const pdf = doc.output('blob');
        const url = URL.createObjectURL(pdf);
        window.open(url);
    }
});
