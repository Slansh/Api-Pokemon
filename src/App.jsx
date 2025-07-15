import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Info, FormInput, BookOpen, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

// -----------------------------------------------------------------------------
// 1. Context API para gerir Pokémon Vistos Recentemente
// -----------------------------------------------------------------------------
const RecentlyViewedPokemonContext = createContext();

const RecentlyViewedPokemonProvider = ({ children }) => {
  // Inicializa o estado com dados do localStorage, se existirem
  const [recentlyViewedPokemon, setRecentlyViewedPokemon] = useState(() => {
    try {
      const stored = localStorage.getItem('recentlyViewedPokemon');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load recently viewed Pokémon from localStorage", e);
      return [];
    }
  });

  // Salva o estado no localStorage sempre que ele muda
  useEffect(() => {
    try {
      localStorage.setItem('recentlyViewedPokemon', JSON.stringify(recentlyViewedPokemon));
    } catch (e) {
      console.error("Failed to save recently viewed Pokémon to localStorage", e);
    }
  }, [recentlyViewedPokemon]);

  // Adiciona um Pokémon à lista de vistos recentemente (limita a 5)
  const addRecentlyViewedPokemon = (pokemon) => {
    setRecentlyViewedPokemon(prev => {
      // Remove se já existir para evitar duplicatas e mover para o topo
      const filtered = prev.filter(p => p.id !== pokemon.id);
      return [pokemon, ...filtered].slice(0, 5); // Limita aos 5 mais recentes
    });
  };

  return (
    <RecentlyViewedPokemonContext.Provider value={{ recentlyViewedPokemon, addRecentlyViewedPokemon }}>
      {children}
    </RecentlyViewedPokemonContext.Provider>
  );
};

// -----------------------------------------------------------------------------
// Componente Principal da Aplicação
// -----------------------------------------------------------------------------
const App = () => {
  return (
    // Router envolve toda a aplicação para habilitar o roteamento
    <Router>
      <RecentlyViewedPokemonProvider> {/* Provedor do Contexto */}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter text-gray-800">
          {/* Barra de Navegação */}
          <NavBar />

          {/* Conteúdo da Página - Gerido por Routes */}
          <main className="container mx-auto p-6 mt-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pokemon-search" element={<PokemonSearchPage />} />
              <Route path="/pokemon-list" element={<PokemonListPage />} />
              <Route path="/form" element={<FormPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Rota de fallback para 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </RecentlyViewedPokemonProvider> {/* Corrigido: Tag de fecho completa */}
    </Router>
  );
};

// -----------------------------------------------------------------------------
// Componente da Barra de Navegação
// -----------------------------------------------------------------------------
const NavBar = () => {
  const location = useLocation(); // Hook para obter a localização atual e estilizar o link ativo

  const getNavLinkClass = (path) => {
    return `flex items-center px-4 py-2 rounded-lg transition-all duration-300 ease-in-out
            ${location.pathname === path ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'}`;
  };

  return (
    <nav className="bg-white shadow-md p-4 rounded-b-xl">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4 sm:mb-0">Meu Site Dinâmico</h1>
        <ul className="flex flex-wrap justify-center gap-4">
          <li>
            <NavLink to="/" className={getNavLinkClass('/')}>
              <Home className="mr-2" size={20} /> Início
            </NavLink>
          </li>
          <li>
            <NavLink to="/pokemon-search" className={getNavLinkClass('/pokemon-search')}>
              <Search className="mr-2" size={20} /> Pesquisar Pokémon
            </NavLink>
          </li>
          <li>
            <NavLink to="/pokemon-list" className={getNavLinkClass('/pokemon-list')}>
              <BookOpen className="mr-2" size={20} /> Lista de Pokémon
            </NavLink>
          </li>
          <li>
            <NavLink to="/form" className={getNavLinkClass('/form')}>
              <FormInput className="mr-2" size={20} /> Formulário
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={getNavLinkClass('/about')}>
              <Info className="mr-2" size={20} /> Sobre
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// -----------------------------------------------------------------------------
// Componente da Página Inicial
// -----------------------------------------------------------------------------
const HomePage = () => {
  const { recentlyViewedPokemon } = useContext(RecentlyViewedPokemonContext);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">Bem-vindo ao Nosso Site Dinâmico!</h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        Este é um exemplo de site construído com React, utilizando rotas para navegação entre as páginas e integração com a PokeAPI.
        Explore as diferentes secções usando a barra de navegação acima.
      </p>
      <div className="mt-8 flex justify-center">
        <img
          src="https://placehold.co/600x300/e0e7ff/4338ca?text=Site+Din%C3%A2mico"
          alt="Imagem de boas-vindas"
          className="rounded-lg shadow-md max-w-full h-auto"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x300/e0e7ff/4338ca?text=Erro+ao+Carregar+Imagem"; }}
        />
      </div>

      {recentlyViewedPokemon.length > 0 && (
        <div className="mt-12 p-6 bg-indigo-50 rounded-xl shadow-inner">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center justify-center">
            <Eye className="mr-2" size={24} /> Pokémon Vistos Recentemente
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recentlyViewedPokemon.map(pokemon => (
              <Link to={`/pokemon-search?name=${pokemon.name}`} key={pokemon.id} className="block p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <img
                  src={pokemon.sprites.front_default || "https://placehold.co/100x100/cccccc/333333?text=Sem+Imagem"}
                  alt={pokemon.name}
                  className="w-20 h-20 mx-auto mb-2 object-contain"
                />
                <p className="text-sm font-medium text-gray-800 capitalize">{pokemon.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Componente da Página de Pesquisa de Pokémon Individual
// -----------------------------------------------------------------------------
const PokemonSearchPage = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addRecentlyViewedPokemon } = useContext(RecentlyViewedPokemonContext);
  const location = useLocation(); // Para ler parâmetros da URL

  // Efeito para carregar Pokémon se o nome estiver na URL (ex: de "Vistos Recentemente")
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const nameFromUrl = queryParams.get('name');
    if (nameFromUrl && nameFromUrl !== pokemonName) {
      setPokemonName(nameFromUrl);
      fetchPokemonData(nameFromUrl);
    }
  }, [location.search]); // Depende da mudança na query string

  // Função para buscar dados do Pokémon
  const fetchPokemonData = async (nameToFetch = pokemonName) => {
    if (!nameToFetch.trim()) {
      setError('Por favor, digite o nome de um Pokémon.');
      setPokemonData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setPokemonData(null);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameToFetch.toLowerCase()}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Pokémon "${nameToFetch}" não encontrado. Verifique a grafia.`);
        }
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      const data = await response.json();
      setPokemonData(data);
      addRecentlyViewedPokemon(data); // Adiciona ao contexto de vistos recentemente
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchPokemonData();
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">Pesquisar Pokémon</h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="text"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite o nome do Pokémon (ex: ditto)"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg max-w-md"
        />
        <button
          onClick={() => fetchPokemonData()} // Chama sem argumento para usar o estado atual
          className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <Search className="mr-2" size={20} /> Pesquisar
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="ml-4 text-xl text-indigo-600">Carregando dados do Pokémon...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="text-sm mt-2">Por favor, tente novamente.</p>
        </div>
      )}
      {pokemonData && !loading && !error && (
        <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50 text-center">
          <h3 className="text-3xl font-semibold text-indigo-800 mb-4 capitalize">{pokemonData.name}</h3>
          <p className="text-xl text-gray-700 mb-4">ID: #{pokemonData.id}</p>
          <div className="flex justify-center mb-6">
            <img
              src={pokemonData.sprites.front_default || "https://placehold.co/200x200/cccccc/333333?text=Sem+Imagem"}
              alt={`Imagem de ${pokemonData.name}`}
              className="w-48 h-48 object-contain rounded-lg shadow-md bg-white p-2"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x200/cccccc/333333?text=Sem+Imagem"; }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="text-xl font-medium text-indigo-700 mb-2">Tipos:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {pokemonData.types.map((typeInfo) => (
                  <li key={typeInfo.slot} className="capitalize">{typeInfo.type.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-medium text-indigo-700 mb-2">Habilidades:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {pokemonData.abilities.map((abilityInfo) => (
                  <li key={abilityInfo.ability.name} className="capitalize">{abilityInfo.ability.name}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-xl font-medium text-indigo-700 mb-2">Estatísticas Base:</h4>
              <div className="space-y-2">
                {pokemonData.stats.map(statInfo => (
                  <div key={statInfo.stat.name} className="flex items-center">
                    <span className="w-32 font-semibold capitalize text-gray-700">{statInfo.stat.name}:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-indigo-500 h-4 rounded-full"
                        style={{ width: `${(statInfo.base_stat / 255) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-800">{statInfo.base_stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-sm">
            Dados obtidos da PokeAPI. Experimente pesquisar outros Pokémon!
          </p>
        </div>
      )}
      {!pokemonData && !loading && !error && (
        <p className="text-center text-gray-600 text-lg">
          Use a barra de pesquisa acima para encontrar informações sobre um Pokémon.
        </p>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Componente da Página de Lista de Pokémon com Paginação
// -----------------------------------------------------------------------------
const PokemonListPage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0); // Offset para paginação
  const [count, setCount] = useState(0); // Total de Pokémon disponíveis
  const [searchTerm, setSearchTerm] = useState(''); // Termo de pesquisa para filtrar a lista
  const limit = 20; // Número de Pokémon por página

  useEffect(() => {
    fetchPokemonList();
  }, [offset]); // Refetch quando o offset muda (para paginação)

  const fetchPokemonList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      const data = await response.json();
      setPokemonList(data.results);
      setCount(data.count); // Define o total de Pokémon
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (offset + limit < count) {
      setOffset(prev => prev + limit);
    }
  };

  const handlePreviousPage = () => {
    if (offset - limit >= 0) {
      setOffset(prev => prev - limit);
    }
  };

  // Filtra a lista de Pokémon exibida com base no termo de pesquisa
  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">Lista de Pokémon</h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar por nome..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg max-w-md"
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="ml-4 text-xl text-indigo-600">Carregando lista de Pokémon...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="text-sm mt-2">Não foi possível carregar a lista de Pokémon. Por favor, tente novamente.</p>
        </div>
      )}
      {!loading && !error && filteredPokemon.length === 0 && (
        <p className="text-center text-gray-600 text-lg">Nenhum Pokémon encontrado com este filtro.</p>
      )}
      {!loading && !error && filteredPokemon.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPokemon.map((pokemon) => (
              <Link
                to={`/pokemon-search?name=${pokemon.name}`} // Link para a página de pesquisa individual
                key={pokemon.name}
                className="block p-4 bg-indigo-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center capitalize"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`}
                  alt={pokemon.name}
                  className="w-24 h-24 mx-auto mb-2 object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/96x96/cccccc/333333?text=Sem+Imagem"; }}
                />
                <p className="font-medium text-gray-800">{pokemon.name}</p>
              </Link>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={offset === 0}
              className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft size={20} className="mr-2" /> Anterior
            </button>
            <span className="text-gray-700">
              Página {Math.floor(offset / limit) + 1} de {Math.ceil(count / limit)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={offset + limit >= count}
              className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Próximo <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Componente da Página de Formulário
// -----------------------------------------------------------------------------
const FormPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({}); //Estado para error de validação
  const [submitted, setSubmitted] = useState(false);

  const validade = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'A mensagem é obrigatória.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]:value });
    //Limpa o erro para o campo enquanto o utilizador digita
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]:undefined }));
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (validade()) {
      //Aqui você enviaria os dados do formulário para uma API ou faria alguma ação
      console.log('Dados do formulário enviados: ', formData);
      setSubmitted(true);
      //Em um cenário real, o formulário serai resetado após o envio bem sucedido
      //setFormData({ name: '', email: '', message: '' });
    } else {
      console.log('Validação falhou: ', errors);
    }
  };

  return (
    <div className='bg-white p-8 rounded-xl shadow-lg'>
      <h2 className='text-4xl font-extrabold text-indigo-700 mb-6 text-center'>Entre em Contato</h2>
      {submitted ? (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center' role='alert'>
          <strong className='font-bold'>Sucesso!</strong>
          <span className='block sm:inline'>A sua mensagem foi enviada. Entraremos em contato em breve.</span>
          <p className='mt-2 text-sm'>Nome: {formData.name}</p>
          <p className='text-sm'>Email: {formData.email}</p>
          <p className='text-sm'>Mensagem: {formData.message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='max-w-xl mx-auto space-y-6'>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="O seu nome completo"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="o.seu.email@exemplo.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className={`mt-1 block w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="Escreva a sua mensagem aqui..."
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Enviar Mensagem
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Componente da Página Sobre
// -----------------------------------------------------------------------------
const AboutPage = () => (
  <div className='bg-white p-8 rounded-xl shadow-lg'>
    <h2 className='text-4xl  font-extrabold text-indigo-700 mb-6 text-center'>Sobre Nós</h2>
    <div className='prose max-w-none text-gray-700 leading-relaxed'>
      <p>
        Este site foi criado como um projeto de demonstração para ilustrar a construção de uma aplicação web dinâmica
        usando <strong>React</strong>. Ele incorpora conceitos essenciais como:
      </p>
      <ul className='list-disc list-inside space-y-2 mt-4'>
        <li>
          <strong>Componetes Reutilizáveis:</strong> A arquitetura beseada em componentes do Reactpermite um desenvolvimento modular e eficiente.
        </li>
        <li>
          <strong>Gerenciamento de Estado:</strong> Utilização de <strong>useState</strong> para gerenciar o estado dos componentes e <strong>useEffect</strong>.
        </li>
        <li>
          <strong>Roteamento Real:</strong> Implementação  de navegação com <strong>react-router-dom</strong> para  URLs amigáveis.
        </li>
        <li>
          <strong>Integração com API:</strong> Demonstração de como buscar dados de uma API externa (PokeAPI) e exibi-los na interface do utilizador.
        </li>
        <li>
          <strong>Estilização Responsiva:</strong> Uso do <strong>Tailwind CSS</strong> para criar uma interface moderna e que se adapta a diferentes tamanhos de ecrã (desktop, tablet, mobile).
        </li>
        <li>
          <strong>Gestão de Estado Global (context API):</strong> Exemplo de como criar a context API para partilhar dados entre componentes (Pokémon vistos recentemente).
        </li>
      </ul>
      <p className='mt-6'>
        O meu objetivo é fazer uma base sólida para que deseja iniciar ou aprofundar os seus conhecimentos em desenvolvimento front-end com rect. Sinta-se à vontade para explorar o código e adaptá-lo às suas necessidade!
      </p>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
    
  </div>
)

export default App;