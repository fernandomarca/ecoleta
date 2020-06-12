import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './style.css'

interface Props {
    onFileUploaded: (File: File) => void;
}

const Dropzone: React.FC<Props> = (props) => {


    const [selecteFileUrl, setSelecteFileUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {

        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        setSelecteFileUrl(fileUrl);
        props.onFileUploaded(file);
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (
        <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} accept="image/*" />

            {selecteFileUrl
                ? <img src={selecteFileUrl} alt="point thumbnail" />
                : (
                    <p>
                        <FiUpload />
                    Arraste seu arquivo aqui para upload <br />
                    ou <br />
                    clique para selecionar...
                    </p>
                )
            }


        </div>
    )
}

export default Dropzone;