import { useRef } from 'react';
import jsPDF from 'jspdf';
import previews from '@/styles/Preview.module.css'
import TemplatePage from './previewTemplate'

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
			autoPaging: true,
			margin: 40,
		});
	};

	return (
		<div>
			<button className="button" onClick={handleGeneratePdf}>
				Generate PDF
			</button>
			<div className={previews.paperEdit} style = {{margin: "calc(50% - 21cm/2)", marginTop: "5vh"}}>
				<div ref = { templatePageRef }>
					<TemplatePage />
				</div>
			</div>
		</div>
	);
}

export default App;