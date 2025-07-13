import react from "react";

export default function InputMensajes() {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{}</label>
            <textarea
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="4"
            />
        </div>
    );
}
