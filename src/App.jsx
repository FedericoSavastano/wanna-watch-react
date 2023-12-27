import { useEffect, useState } from 'react';
import texts from './data/texts';
import { platforms, genres, types } from './data/selectors';
import supabase from './data/supabase';

import './App.css';

function App() {
    //Initial general states
    const [language, setLanguage] = useState('eng');
    const [sortOption, setSortOption] = useState('likeVotes');
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    //Query for SupaBase
    const [filterQuery, setFilterQuery] = useState({});

    //Recommendations Local
    const [recomendations, setRecomendations] = useState([]);

    //For editing recommendation
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const [editRecommendation, setEditRecommendation] = useState({});

    useEffect(() => {
        setLanguage(language);
    }, [language]);

    useEffect(() => {
        setShowForm(Object.keys(editRecommendation).length);
    }, [editRecommendation]);

    // useEffect(() => {
    //     let query;

    //     async function getQuerys() {
    //         setIsLoading(true);

    //         query = supabase.from('wanna-watch').select('*');

    //         if (filterQuery.genre) query.contains('genre', [filterQuery.genre]);
    //         if (filterQuery.type) query.eq('type', filterQuery.type);
    //         if (filterQuery.platform)
    //             query.eq('platform', filterQuery.platform);
    //         const { data: recs, error } = await query
    //             .order(filterQuery.order ? filterQuery.order : 'likeVotes', {
    //                 ascending: false,
    //             })
    //             .limit(1000);

    //         if (!error) setRecomendations(recs);

    //         setIsLoading(false);
    //     }

    //     getQuerys();
    // }, [filterQuery]);

    useEffect(() => {
        async function getQuerys() {
            setIsLoading(true);
            setRecomendations({});
            const { data: recs, error } = await supabase
                .from('wanna-watch')
                .select('*')
                .order(filterQuery.order ? filterQuery.order : 'likeVotes', {
                    ascending: false,
                })
                .limit(1000);

            if (!ignore) if (!error) setRecomendations(recs);

            setIsLoading(false);
        }
        let ignore = false;
        getQuerys();

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        let query;

        async function getQuerys() {
            setIsLoading(true);
            setRecomendations({});
            query = supabase.from('wanna-watch').select('*');

            if (filterQuery.genre) query.contains('genre', [filterQuery.genre]);
            if (filterQuery.type) query.eq('type', filterQuery.type);
            if (filterQuery.platform)
                query.eq('platform', filterQuery.platform);
            const { data: recs, error } = await query
                .order(filterQuery.order ? filterQuery.order : 'likeVotes', {
                    ascending: false,
                })
                .limit(1000);

            if (!ignore) if (!error) setRecomendations(recs);

            setIsLoading(false);
        }
        let ignore = false;
        getQuerys();

        return () => {
            ignore = true;
        };
    }, [filterQuery]);

    useEffect(() => {
        setIsLoading(true);
        const order = sortOption;
        let sortedRecs = [];
        if (order === 'created_at') {
            sortedRecs = recomendations.sort(
                (firstItem, secondItem) =>
                    Number(secondItem[order].replace(/\D/g, '')) -
                    Number(firstItem[order].replace(/\D/g, ''))
            );
        } else {
            sortedRecs = recomendations.sort(
                (firstItem, secondItem) => secondItem[order] - firstItem[order]
            );
        }

        setRecomendations(sortedRecs);
        console.log('order', sortOption);
        console.log(sortedRecs.map((r) => r.likeVotes + ' ' + r.name));
        console.log(recomendations.map((r) => r.likeVotes + ' ' + r.name));
        setIsLoading(false);
    }, [sortOption]);

    return (
        <>
            <div className='container'>
                <Header
                    language={language}
                    setShowForm={setShowForm}
                    showForm={showForm}
                    isEdit={isEdit}
                    setEditId={setEditId}
                    setEditRecommendation={setEditRecommendation}
                    isLoading={isLoading}></Header>

                {showForm ? (
                    <div className='main-form'>
                        <RecomendationForm
                            language={language}
                            isEdit={isEdit}
                            editId={editId}
                            editRecommendation={editRecommendation}
                            setFilterQuery={setFilterQuery}
                            setShowForm={setShowForm}
                            setEditRecommendation={
                                setEditRecommendation
                            }></RecomendationForm>
                    </div>
                ) : (
                    <div className='main'>
                        <Filter
                            language={language}
                            setFilterQuery={setFilterQuery}
                            isLoading={isLoading}></Filter>

                        {isLoading ? (
                            <Loader></Loader>
                        ) : (
                            <Recommendations
                                language={language}
                                recomendations={recomendations}
                                setRecomendations={setRecomendations}
                                setIsEdit={setIsEdit}
                                setEditId={setEditId}
                                setShowForm={setShowForm}
                                setEditRecommendation={setEditRecommendation}
                                setSortOption={setSortOption}
                                setFilterQuery={
                                    setFilterQuery
                                }></Recommendations>
                        )}
                    </div>
                )}

                <Footer setLanguage={setLanguage} language={language}></Footer>
            </div>
        </>
    );
}

function Header({
    language,
    setShowForm,
    showForm,
    setEditId,
    setEditRecommendation,
    isLoading,
}) {
    const [isBackButton, setIsBackButton] = useState(false);

    useEffect(() => {
        setIsBackButton(showForm);
    }, [showForm]);

    return (
        <>
            <header className='header'>
                <div
                    className='logo'
                    onClick={() => (window.location.href = '/')}>
                    <img src='ww-logo.png' alt='wanna watch logo' />
                    <h1>Wanna Watch?</h1>
                </div>

                <button
                    className='btn btn-add-new sketchy-button'
                    disabled={isLoading}
                    onClick={() => {
                        setShowForm(!showForm);

                        if (isBackButton) {
                            setEditRecommendation({});
                        }
                    }}>
                    {isBackButton ? texts[language].back : texts[language].add}
                </button>
            </header>
        </>
    );
}

function Footer({ language, setLanguage }) {
    return (
        <>
            <footer className='footer'>
                <div className='logo-footer'>
                    <img src='ww-logo.png' alt='wanna watch logo' />
                    <h5>Wanna Watch?</h5>
                </div>

                <span>
                    {texts[language].madeBy}{' '}
                    <a
                        href='https://federicosavastano.netlify.app'
                        target='_blank'>
                        Federico_Savastano
                    </a>
                </span>

                <form name='language-selector'>
                    <label>
                        {texts[language].selectLanguage}:{' '}
                        <select
                            onChange={(e) =>
                                setLanguage(e.currentTarget.value)
                            }>
                            <option value='eng'>English</option>
                            <option value='spa'>Español</option>
                            <option value='por'>Português</option>
                            <option value='ger'>Deutsch</option>
                            <option value='ita'>Italiano</option>
                        </select>
                    </label>
                </form>
            </footer>
        </>
    );
}

// FILTER

/// PONER QUE EN MOBILE, APAREZCAN LOS FILTROS ESCONDIDOS Y QUE HAYA UN BOTON EXTRA DE RESETEO
function Filter({ language, setFilterQuery, isLoading }) {
    const [showType, setShowType] = useState(true);
    const [showGenre, setShowGenre] = useState(true);
    const [showPlatform, setShowPlatform] = useState(true);

    const [genre, setGenre] = useState([]);
    const [platform, setPlatform] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        setFilterQuery({ genre, platform, type });
    }, [genre, platform, type]);

    const handleOpenFilterList = () => {};

    return (
        <div className='filter-list'>
            <div>
                {' '}
                <button
                    onClick={() => {
                        setShowType(!showType);
                    }}
                    className='sketchy-button btn-filter'
                    disabled={isLoading}>
                    Filter by Type {showType ? '🔺' : '🔻'}
                </button>
                {showType && (
                    <TypeList
                        language={language}
                        setType={setType}
                        isLoading={isLoading}
                        type={type}></TypeList>
                )}
            </div>
            <div>
                {' '}
                <button
                    onClick={() => {
                        setShowGenre(!showGenre);
                    }}
                    className='sketchy-button btn-filter'
                    disabled={isLoading}>
                    Filter by Genre {showGenre ? '🔺' : '🔻'}
                </button>
                {showGenre && (
                    <GenreList
                        language={language}
                        setGenre={setGenre}
                        genre={genre}
                        isLoading={isLoading}></GenreList>
                )}
            </div>
            <div>
                {' '}
                <button
                    onClick={() => setShowPlatform(!showPlatform)}
                    className='sketchy-button btn-filter'
                    disabled={isLoading}>
                    Filter by Platform {showPlatform ? '🔺' : '🔻'}
                </button>
                {showPlatform && (
                    <PlatformList
                        language={language}
                        setPlatform={setPlatform}
                        isLoading={isLoading}
                        platform={platform}></PlatformList>
                )}
            </div>
        </div>
    );
}

function GenreList({ language, setGenre, isLoading, genre }) {
    const [isAllClicked, setIsAllClicked] = useState(true);
    useEffect(() => {
        if (genre.length) {
            setIsAllClicked(false);
        } else {
            setIsAllClicked(true);
        }
    }, [genre]);
    return (
        <aside>
            <ul className='genre-list'>
                <li className='genre-list-item'>
                    {' '}
                    <button
                        className='btn btn-genre sketchy-button'
                        onClick={() => {
                            setGenre([]);
                            setIsAllClicked(!isAllClicked);
                        }}
                        style={{
                            backgroundColor: isAllClicked
                                ? 'purple'
                                : 'rgb(233 0 0)',
                        }}>
                        {texts[language].genres.All}
                    </button>
                </li>
                {genres.map((gen) => (
                    <GenreListItem
                        key={gen.name}
                        gen={gen}
                        language={language}
                        setGenre={setGenre}
                        genre={genre}
                        isLoading={isLoading}
                        isAllClicked={isAllClicked}
                        setIsAllClicked={setIsAllClicked}></GenreListItem>
                ))}
            </ul>
        </aside>
    );
}

function GenreListItem({
    gen,
    language,
    setGenre,
    isLoading,
    isAllClicked,
    setIsAllClicked,
    genre,
}) {
    const [isClicked, setIsClicked] = useState(false);

    const handleSelectGenre = (genreSelected) => {
        let newArrayGenre = [];
        // setIsAllClicked(false);
        //Remove
        if (genre.includes(genreSelected)) {
            newArrayGenre = genre.filter((g) => g !== genreSelected);
            setIsClicked(false);
        }

        console.log(newArrayGenre);

        //Add
        if (!genre.includes(genreSelected)) {
            newArrayGenre = [...genre, genreSelected];
            setIsClicked(true);
        }

        setGenre(newArrayGenre);
    };
    useEffect(() => {
        if (isAllClicked) setIsClicked(false);
    }, [isAllClicked]);
    return (
        <li className='genre-list-item'>
            {' '}
            <button
                className='btn btn-genre sketchy-button'
                onClick={() => {
                    handleSelectGenre(gen.name);
                }}
                disabled={isLoading}
                style={{
                    backgroundColor: isClicked ? 'purple' : 'rgb(233 0 0)',
                }}>
                {texts[language].genres[gen.name]}
            </button>
        </li>
    );
}

function PlatformList({ language, setPlatform, isLoading, platform }) {
    return (
        <aside>
            <ul className='genre-list'>
                {platforms.map((plat) => (
                    <PlatformListItem
                        key={plat.name}
                        setPlatform={setPlatform}
                        plat={plat}
                        isLoading={isLoading}
                        platform={platform}
                        language={language}></PlatformListItem>
                ))}
            </ul>
        </aside>
    );
}

function PlatformListItem({
    setPlatform,
    plat,
    isLoading,

    platform,
    language,
}) {
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        plat.name === platform ? setIsClicked(true) : setIsClicked(false);
    }, [platform]);
    return (
        <li className='genre-list-item'>
            {' '}
            <button
                className='btn btn-genre sketchy-button'
                disabled={isLoading}
                onClick={() => {
                    setPlatform(isClicked ? '' : plat.name);
                    // setIsClicked(!isClicked);
                }}
                style={{
                    backgroundColor: isClicked ? 'blue' : 'rgb(233 0 0)',
                }}>
                {plat.name || texts[language].genres.All}
            </button>
        </li>
    );
}

function TypeList({ language, setType, isLoading, type }) {
    // const [isAllClicked, setIsAllClicked] = useState(false);
    return (
        <aside>
            <ul className='genre-list'>
                {/* <li className='genre-list-item'>
                    {' '}
                    <button
                        className='btn btn-genre  sketchy-button'
                        disabled={isLoading}
                        onClick={() => {
                            setType('');
                            setIsAllClicked(!isAllClicked);
                        }}
                        style={{
                            backgroundColor: isAllClicked
                                ? 'green'
                                : 'rgb(233, 0, 0)',
                        }}>
                        {texts[language].genres.All}
                    </button>
                </li> */}
                {types.map((t) => (
                    <TypeListItem
                        key={t.name}
                        language={language}
                        setType={setType}
                        t={t}
                        type={type}
                        isLoading={isLoading}></TypeListItem>
                ))}
            </ul>
        </aside>
    );
}

function TypeListItem({ language, setType, t, isLoading, type }) {
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        t.name === type ? setIsClicked(true) : setIsClicked(false);
    }, [type]);

    return (
        <li className='genre-list-item'>
            {' '}
            <button
                className='btn btn-genre sketchy-button'
                disabled={isLoading}
                onClick={() => {
                    setType(isClicked ? '' : t.name);
                    // setIsClicked(!isClicked);
                }}
                style={{
                    backgroundColor: isClicked ? 'green' : 'rgb(233, 0, 0)',
                }}>
                {texts[language].types[t.name] || texts[language].genres.All}
            </button>
        </li>
    );
}

//RECOMENDATIONS
function RecommendationsList({ language }) {
    return (
        <aside>
            <ul className='recommendations-list'>
                {texts[language].genres.map((gen) => (
                    <li key={gen.name} className='recommendations-list-item'>
                        {' '}
                        <button
                            className='btn btn-genre'
                            style={{ backgroundColor: gen.color }}>
                            {gen.name}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

function Recommendations({
    language,
    recomendations,
    setIsEdit,
    setEditId,
    setShowForm,
    setEditRecommendation,
    setSortOption,
    setFilterQuery,
    setRecomendations,
}) {
    const [sortedRecs, setSortedRecs] = useState(recomendations);
    const [recsLocal, setRecsLocal] = useState(recomendations);
    useEffect(() => {
        setRecsLocal(recomendations);
    }, [recomendations]);

    useEffect(() => {
        setRecsLocal(sortedRecs);
    }, [sortedRecs]);

    console.log('Recomendations desde Recommendations ', recomendations);
    function handleOrder(e) {
        // e.preventDefault();
        // setSortOption(e.currentTarget.value);

        const order = e.currentTarget.value;
        let sortedRecos = [];

        if (order === 'created_at') {
            sortedRecos = [...recomendations].sort(
                (firstItem, secondItem) =>
                    Number(secondItem[order].replace(/\D/g, '')) -
                    Number(firstItem[order].replace(/\D/g, ''))
            );
        } else {
            sortedRecos = [...recomendations].sort(
                (firstItem, secondItem) => secondItem[order] - firstItem[order]
            );
        }

        setSortedRecs(sortedRecos);
    }

    // HACER EL SORTING DESDE ACA CON EL MAP
    return (
        <div className='recomendations'>
            List of recomendations{' '}
            <form name='language-selector'>
                <label>
                    sort by:{' '}
                    <select onChange={(e) => handleOrder(e)}>
                        <option value='likeVotes'>Most Voted</option>
                        <option value='dislikeVotes'>Least Voted</option>
                        <option value='created_at'>Newest</option>
                    </select>
                </label>
            </form>
            <ul>
                {recsLocal.length ? (
                    recsLocal.map((r) => (
                        <RecommendationItem
                            key={r.id}
                            language={language}
                            r={r}
                            setEditId={setEditId}
                            setIsEdit={setIsEdit}
                            setShowForm={setShowForm}
                            setEditRecommendation={setEditRecommendation}
                            setFilterQuery={setFilterQuery}
                            recsLocal={recsLocal}
                            setRecsLocal={setRecsLocal}></RecommendationItem>
                    ))
                ) : (
                    <p>{texts[language].empty}</p>
                )}
            </ul>
        </div>
    );
}

function DeleteModal({ setShowDeleteModal, setConfirmDelete }) {
    return (
        <div id='myModal' className='modal'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <button
                        className='close'
                        onClick={() => setShowDeleteModal(false)}>
                        {' '}
                        <span>&times;</span>
                    </button>
                    <h2>Confirm delete</h2>
                </div>
                <div className='modal-body'>
                    <p>Sure you want to delete?</p>
                    <button onClick={() => setConfirmDelete(true)}>
                        Yes
                    </button>{' '}
                    <button onClick={() => setShowDeleteModal(false)}>
                        No
                    </button>
                </div>
                <div className='modal-footer'>
                    {/* <h3>Modal Footer</h3> */}
                </div>
            </div>
        </div>
    );
}

function RecommendationItem({
    language,
    r,
    setEditId,
    setIsEdit,
    setShowForm,
    setFilterQuery,
    setEditRecommendation,
    setRecsLocal,
    recsLocal,
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [isMustWatch, setIsMustWatch] = useState(false);

    const handleShowDeleteModal = (id) => {
        setShowDeleteModal(true);
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (confirmDelete) {
            const {
                data: afterdelete,
                error,
                status,
            } = await supabase.from('wanna-watch').delete().eq('id', deleteId);
            console.log('el delete', status);
            setShowDeleteModal(false);
            setConfirmDelete(false);
            setDeleteId('');
            setFilterQuery({});
        }
    };

    async function handleVote(voteType) {
        // setIsUpdating(true);
        const { data: updatedVote, error } = await supabase
            .from('wanna-watch')
            .update({ [voteType]: r[voteType] + 1 })
            .eq('id', r.id)
            .select();
        // setIsUpdating(false);

        console.log(updatedVote);
        // if (!error) setFilterQuery({});

        if (!error)
            setRecsLocal((rec) =>
                rec.map((rec) => (rec.id === r.id ? updatedVote[0] : rec))
            );
        // setFacts((facts) =>
        //         facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
        //     );
    }

    useEffect(() => {
        handleDelete();
    }, [confirmDelete]);

    useEffect(() => {
        r.likeVotes > 5 && r.likeVotes > r.dislikeVotes * 5
            ? setIsMustWatch(true)
            : setIsMustWatch(false);
    }, [r.likeVotes]);

    return (
        <>
            {showDeleteModal && (
                <DeleteModal
                    setShowDeleteModal={setShowDeleteModal}
                    setConfirmDelete={setConfirmDelete}></DeleteModal>
            )}
            <li className='sketchy'>
                <div className='reco-button-list-top'>
                    {r.by ? <span>{r.by} recomended</span> : <span></span>}
                    <span className='reco-button-list-top-buttons'>
                        <button
                            className='reco-button reco-button-edit'
                            onClick={() => {
                                // setEditId(r.id);
                                // setIsEdit(true);

                                // setShowForm(true);

                                setEditRecommendation(r);
                            }}>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                height='1em'
                                className='reco-icon-edit'
                                alt='edit icon'
                                viewBox='0 0 576 512'>
                                {' '}
                                <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z' />
                            </svg>
                            Edit
                        </button>
                        <button
                            className='reco-button reco-button-delete'
                            onClick={() => {
                                handleShowDeleteModal(r.id);
                            }}>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                height='1em'
                                className='reco-icon-delete'
                                alt='delete icon'
                                viewBox='0 0 448 512'>
                                {' '}
                                <path d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z' />
                            </svg>
                            Delete
                        </button>
                    </span>
                </div>
                {isMustWatch && <p>MUST WATCH</p>}
                <h2 className='reco-title'> {r.name}</h2>
                <p className='reco-desc'>{r.desc}</p>
                {/* // PLATFORM: {r.platform} // TYPE: {r.type} // */}
                <div className='reco-type-link'>
                    <p>
                        {/* {r.type ? `It's a ${r.type}` : `Don't know what it is`},{' '} */}
                        {r.type ? (
                            <>
                                <i>It's a</i> {r.type.toUpperCase()}{' '}
                            </>
                        ) : (
                            <>
                                <i>Don't know what it is</i>
                            </>
                        )}
                        {/* {r.type & r.platform ? `and` : `but`}{' '} */}
                        {', '}
                        {r.platform ? (
                            <>
                                <i>it's on</i> {r.platform.toUpperCase()}{' '}
                            </>
                        ) : (
                            <>
                                <i>Don't know where it is</i>
                            </>
                        )}
                    </p>
                    {/* // LINK : {r.link} */}
                    {r.link && (
                        <a href={r.link} target='_blank'>
                            Look here
                        </a>
                    )}
                </div>
                <p style={{ paddingBottom: '20px' }}>{r.genre.join(' - ')}</p>
                <div className='vote-btn-wrapper'>
                    <button
                        onClick={() => {
                            console.log('UP');
                            handleVote('likeVotes', r);
                        }}
                        className='vote-btn'>
                        👍 {r.likeVotes}
                    </button>

                    <button
                        onClick={() => {
                            console.log('DOWN');
                            handleVote('dislikeVotes', r);
                        }}
                        className='vote-btn'>
                        👎 {r.dislikeVotes}
                    </button>
                </div>
            </li>
        </>
    );
}

function RecomendationForm({
    language,
    isEdit,
    editId,
    editRecommendation,
    setFilterQuery,
    setShowForm,
    setEditRecommendation,
}) {
    const [name, setName] = useState(editRecommendation?.name || '');
    const [desc, setDesc] = useState(editRecommendation?.desc || '');
    const [link, setLink] = useState(editRecommendation?.link || '');
    const [type, setType] = useState(editRecommendation?.type || '');
    const [platform, setPlatform] = useState(
        editRecommendation?.platform || ''
    );

    const [by, setBy] = useState(editRecommendation?.by || '');
    const [idRec, setIdRec] = useState(editRecommendation?.id || '');

    const [genre, setGenre] = useState(editRecommendation?.genre || []);

    const [genresEdit, setGenresEdit] = useState(
        editRecommendation?.id
            ? genres.map((genre) => ({
                  ...genre,
                  selected: editRecommendation?.genre.includes(genre.name),
              }))
            : []
    );

    const [options, setOptions] = useState(
        editRecommendation?.genre ? genresEdit : genres
    );

    useEffect(() => {
        // genre.includes
        setGenre(genre);
        console.log('Ahora genre es ', genre);
    }, [genre]);

    // console.log('la edit reco', editRecommendation);

    function isValidHttpUrl(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === 'http:' || url.protocol === 'https:';
    }

    const handleSelectOption = (name) => {};

    const toggleOption = (name) => {
        setOptions((prevOptions) =>
            prevOptions.map((option) =>
                option.name === name
                    ? { ...option, selected: !option.selected }
                    : option
            )
        );

        const selectedOptionsE = options
            .filter((option) => option.selected)
            .map((option) => option.name);
        setGenre(selectedOptionsE);
        // console.log("ESTOY EN TOGGLE", selectedOptionsE);
        //
    };

    const selectedOptions = options
        .filter((option) => option.selected)
        .map((option) => option.name);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Submit', selectedOptions);
        //  setGenre(selectedOptions);

        // if(selectedOptions2)   setGenre(selectedOptions2)
        //  setGenre(["Horror", "Comedy", "Romance"]);

        // console.log(platform, genre);

        if ((link ? isValidHttpUrl(link) : true) && name && by && desc) {
            if (editRecommendation?.id) {
                const { data: editRec, error } = await supabase
                    .from('wanna-watch')
                    .update([{ name, desc, link, type, platform, genre, by }])
                    .eq('id', idRec);
            } else {
                const { data: newRec, error } = await supabase
                    .from('wanna-watch')
                    .insert([{ name, desc, link, type, platform, genre, by }])
                    .select();
            }

            setFilterQuery({});
            setShowForm(false);
            setEditRecommendation({});
        } else {
            alert('please check');
        }
    };

    return (
        <>
            <form
                action=''
                onSubmit={handleSubmit}
                className='form sketchy-form'>
                {editRecommendation?.id ? (
                    <h1>Edit this Recommendation</h1>
                ) : (
                    <h1>Add a new Recommendation</h1>
                )}
                <input
                    type='text'
                    name='name'
                    required
                    placeholder='name of your recommendation'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type='text'
                    name='link'
                    placeholder='add a link for more information'
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />

                <textarea
                    type='text'
                    name='desc'
                    required
                    placeholder='why should we watch it?'
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <span className='form-selector'>
                    <label htmlFor='type'>What is it?</label>
                    <select
                        name='type'
                        id='type'
                        value={type}
                        onChange={(e) => setType(e.target.value)}>
                        <option value=''>Don't Know</option>
                        {types.map((type) => (
                            <option key={type.name} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </span>
                <span className='form-selector'>
                    <label htmlFor='platform'> Where is it?</label>
                    <select
                        name='platform'
                        id='platform'
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}>
                        <option value=''>Don't Know</option>
                        {platforms.map((platform) => (
                            <option key={platform.name} value={platform.name}>
                                {platform.name}
                            </option>
                        ))}
                    </select>
                </span>

                <GenreSelector
                    setGenre={setGenre}
                    genre={genre}></GenreSelector>

                {/* <div>
                    <h3>Multi-Select Options:</h3>
                    <ul>
                        {options.map((option) => (
                            <li
                                key={option.name}
                                onClick={() => handleSelectOption(option.name)}>
                                <input
                                    type='checkbox'
                                    checked={option.selected}
                                    readOnly
                                />
                                {option.name}
                                {option.selected}
                            </li>
                        ))}
                    </ul>
                    <p>
                        Selected Options:{' '}
                        {selectedOptions
                            
                            .join(', ')}
                    </p>
                </div> */}

                <input
                    type='text'
                    name='by'
                    required
                    placeholder='who is recommending it?'
                    value={by}
                    onChange={(e) => setBy(e.target.value)}
                />

                <button className='btn' name='button-submit'>
                    Post
                </button>
            </form>
        </>
    );
}

function MultiSelect({ setGenre }) {
    const [options, setOptions] = useState(genres);

    const toggleOption = (name) => {
        setOptions((prevOptions) =>
            prevOptions.map((option) =>
                option.name === name
                    ? { ...option, selected: !option.selected }
                    : option
            )
        );

        // setGenre(selectedOptions);
    };

    const selectedOptions = options.filter((option) => option.selected);

    // useEffect(() => {
    //     setGenre(selectedOptions);
    // }, [selectedOptions]);

    return (
        <div>
            <h3>Multi-Select Options:</h3>
            <ul>
                {options.map((option) => (
                    <li
                        key={option.name}
                        onClick={() => toggleOption(option.name)}>
                        <input
                            type='checkbox'
                            checked={option.selected}
                            readOnly
                        />
                        {option.name}
                        {option.selected}
                    </li>
                ))}
            </ul>
            <p>
                Selected Options:{' '}
                {selectedOptions.map((option) => option.name).join(', ')}
            </p>
        </div>
    );
}

const GenreSelector = ({ genre, setGenre }) => {
    const [tempGenreList, setTempGenreList] = useState(
        genres.map((gen) =>
            genre.includes(gen.name) ? { ...gen, selected: !gen.selected } : gen
        )
    );

    const editedGenreList = tempGenreList
        .filter((gen) => gen.selected === true)
        .map((gen) => gen.name);

    // setGenre(editedGenreList);

    useEffect(() => {
        setGenre(editedGenreList);
        console.log('e s', genre);
    }, [editedGenreList]);

    const handleButtonClick = (e) => {
        e.preventDefault();

        setTempGenreList(
            tempGenreList.map((gen) =>
                gen.name === e.target.textContent
                    ? { ...gen, selected: !gen.selected }
                    : gen
            )
        );

        console.log('ed gen lis', editedGenreList);
    };

    return (
        <>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    padding: '10px',
                }}>
                {tempGenreList.map((gen) => (
                    <button
                        key={gen.name}
                        className={` ${
                            gen.selected ? 'selected' : ''
                        } sketchy-button-genre`}
                        onClick={(e) => handleButtonClick(e)}>
                        {gen.name}
                    </button>
                ))}{' '}
                {/* <p>selected : {editedGenreList.join(' - ')}</p> */}
            </div>
        </>
    );
};

const Loader = () => {
    return <div className='loader'>Loading...</div>;
};
export default App;
