import { useRef } from 'react';
import { ImageUp } from 'lucide-react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from "../shared/constanst";
import withReactContent from 'sweetalert2-react-content';
import { SIO_LOGO_URL } from "../shared/constanst";


const MySwal = withReactContent(Swal);

export default function ImageUploader({ currentImageUrl, onSuccess, operatorId, operatorName }) {
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("auth_token");

  const handleOpenModal = () => {
    MySwal.fire({
      title: `Actualizar logo de ${operatorName}`,
      confirmButtonText: 'Guardar cambios',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: "btn-gradient",
        cancelButton: "btn-cancel",
      },
      didOpen: () => {
        const saveButton = document.querySelector('.swal2-confirm');
        saveButton.disabled = true;
      },
      html: (
        <div className="flex flex-col items-center gap-4">
          <div 
            id="preview-container" 
            style={{ 
              width: '100%', 
              height: '200px', 
              border: '2px dashed #cbd5e1', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: '#f8fafc'
            }}
          >
            {currentImageUrl && currentImageUrl !== "default-icon.png" ? (
              <img src={currentImageUrl} alt="Actual" style={{ maxHeight: '100%' }} onError={(e) => { e.target.src = SIO_LOGO_URL; }} />
            ) : (
              <span style={{ color: '#94a3b8' }}>Sin imagen seleccionada</span>
            )}
          </div>

          <input
            type="file"
            id="swal-input-file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                const container = document.getElementById('preview-container');
                container.innerHTML = `<img src="${url}" style="max-height: 100%; object-fit: contain;" />`;
                Swal.enableButtons();
                window.selectedFile = file; 
              }
            }}
          />

          <button
            type="button"
            className="swal2-styled cursor-pointer btn-gradient" 
            onClick={() => document.getElementById('swal-input-file').click()}
          >
            Seleccionar logo
          </button>
        </div>
      ),
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const file = window.selectedFile;
        if (!file) return false;

        try {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('operatorId', operatorId);
          const res = await fetch(`${API_BASE_URL}/admin/upload`, {
            method: 'POST',
            body: formData,
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error('Error en la subida del logo');
          
          const data = await res.json();
          return data;
        } catch (error) {
          Swal.showValidationMessage(`Error: ${error.message}`);
        }
      },
      willClose: () => {
        delete window.selectedFile;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        onSuccess?.(result.value.url, result.value.publicId);
        Swal.fire('¡Perfecto!', 'La imagen se ha actualizado correctamente.', 'success', {
          confirmButtonText: "Entendido",
          customClass: {
            confirmButton: "btn-gradient",
            cancelButton: "btn-cancel", 
          },
        });
      }
    });
  };

  return (
    <button 
      onClick={handleOpenModal}
      className="px-2 py-2 text-gray-500 hover:text-cyan-600 bg-gray-50 hover:bg-cyan-50 p-2 rounded-md transition-colors inline-flex items-center cursor-pointer"
    >
      <ImageUp className="h-4 w-4"/>
    </button>
  );
}