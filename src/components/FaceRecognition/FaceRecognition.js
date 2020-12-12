import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ box, imageUrl }) => {
	return (
		<div className='align-div ma'>
			<div className='absolute mt4'>
				<img id='inputImage' src={imageUrl} alt='' />
				<div className='bounding-box'
					style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>
				</div>	
			</div>	
		</div>
	);
}

export default FaceRecognition;