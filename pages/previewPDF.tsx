import { useRef } from 'react';
import jsPDF from 'jspdf';
import TemplatePage from './previewTemplate'

const margins = {
	top: 40,
	bottom: 60,
	left: 40,
	width: 522
};

function App() {
	const templatePageRef = useRef(null);

	const handleGeneratePdf = () => {
		const doc = new jsPDF({
			orientation: "p",
			format: 'a4',
			unit: 'px',
			hotfixes: ["px_scaling"],
			floatPrecision: "smart",
		});


		// Adding the fonts.
		doc.setFont('Inter-Regular', 'normal');

		doc.html(templatePageRef.current ?? '', {
			async callback(doc) {
				await doc.save('document');
			},
		});
	};

	return (
		<div>
			<button className="button" onClick={handleGeneratePdf}>
				Generate PDF
			</button>
			<div ref = { templatePageRef }>
				<TemplatePage />
			</div>
		</div>
	);
}

export default App;