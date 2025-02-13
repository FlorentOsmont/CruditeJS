import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ queryLimit, setQueryLimit, queryOffset, setQueryOffset, queryCount }) {
    // Vérification sur la première et dernière page
    const isFirstPage = queryOffset === 0;
    const isLastPage = queryOffset + queryLimit >= queryCount;
    // Fonction pour passer à la page précédente
    const handlePrevious = () => {
        if (!isFirstPage) {
            setQueryOffset(queryOffset - queryLimit)
        }
    }

    const handleNext = () => {
        if (!isLastPage) {
            setQueryOffset(queryOffset + queryLimit)
        }
    }

    return (
        <div className="w-full flex justify-between items-center mt-auto pt-4">
            {/* Sélection de la limite d'affichage */}
            <div className="flex items-center gap-2">
                <label htmlFor="limit" className="text-gray-700">Résultats par page </label>
                <select
                    id="limit"
                    value={queryLimit}
                    onChange={(e) => {
                        setQueryLimit(Number(e.target.value));
                        setQueryOffset(0); // Reset au début
                    }}
                    className="border border-gray-300 text-gray-700 rounded px-2 py-2 hover:bg-gray-200 focus:outline-hidden"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            {/* Total items */}
            <div>
                <p className="text-gray-700">{queryOffset} à {Math.min(queryOffset + queryLimit, queryCount)} sur {queryCount}</p>
            </div>
            {/* Navigation de pagination */}
            <div className="flex items-center">
                <button
                    onClick={handlePrevious}
                    disabled={isFirstPage}
                    className={`w-11 h-11 flex justify-center items-center p-2 rounded-l border border-gray-300 text-gray-700 ${isFirstPage ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-200"
                        }`}
                >
                    <ChevronLeft size="24" />
                </button>

                <span className="w-11 h-11 flex justify-center items-center p-2 border border-gray-300 text-gray-700">
                    {Math.ceil(queryOffset / queryLimit) + 1}
                </span>

                <button
                    onClick={handleNext}
                    disabled={isLastPage}
                    className={`w-11 h-11 flex justify-center items-center p-2 rounded-r border border-gray-300 text-gray-700 ${isLastPage ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-200"
                        }`}
                >
                    <ChevronRight size="24" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;