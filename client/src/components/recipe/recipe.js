import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FcLike, FcDislike } from 'react-icons/fc';
import { FaRegComments } from 'react-icons/fa';

const Recipe = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);

  // State for Add Recipe Modal
  const [openAddRecipeModal, setOpenAddRecipeModal] = useState(false);

  // Add Recipe Form state
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    items: [],
    method: '',
    bottles: []
  });
  const [currentItem, setCurrentItem] = useState({ itemName: '', quantity: '' });
  const [currentGlass, setCurrentGlass] = useState('');

  // Comment input state keyed by recipeId
  const [commentInputs, setCommentInputs] = useState({});
  // Object to control which recipe's comment box is open (each key is a recipeId)
  const [openComments, setOpenComments] = useState({});

  // State for the Recipe Details Modal
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  // Fetch recipes on mount
  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5002/recipe/');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    (recipe.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddRecipeModal = () => {
    setOpenAddRecipeModal(true);
  };

  const handleCloseAddRecipeModal = () => {
    setOpenAddRecipeModal(false);
    setNewRecipe({ name: '', items: [], method: '', bottles: [] });
    setCurrentItem({ itemName: '', quantity: '' });
    setCurrentGlass('');
  };

  const handleAddItem = () => {
    if (currentItem.itemName.trim() && currentItem.quantity.trim()) {
      setNewRecipe((prev) => ({
        ...prev,
        items: [...prev.items, currentItem]
      }));
      setCurrentItem({ itemName: '', quantity: '' });
    }
  };

  const handleAddGlass = () => {
    if (currentGlass.trim()) {
      setNewRecipe((prev) => ({
        ...prev,
        bottles: [...prev.bottles, currentGlass]
      }));
      setCurrentGlass('');
    }
  };

  const handleSubmitRecipe = async () => {
    try {
      const payload = {
        name: newRecipe.name,
        ingredients: newRecipe.items,
        bottles: newRecipe.bottles,
        method: newRecipe.method,
        userName: user?.username,
        byUserId: user?._id
      };

      const response = await axios.post('http://localhost:5002/recipe/', payload);
      const savedRecipe = response.data;
      setRecipes((prev) => [...prev, savedRecipe]);
      handleCloseAddRecipeModal();
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  // Like API call using the same logic
  const handleToggleLike = async (recipeId, e) => {
    e.stopPropagation();
    try {
      const payload = { recipeId, userId: user?._id };
      const response = await axios.put('http://localhost:5002/recipe/like', payload);
      const updatedRecipe = response.data;
      setRecipes((prev) =>
        prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Dislike API call using the same logic
  const handleToggleDislike = async (recipeId, e) => {
    e.stopPropagation();
    try {
      const payload = { recipeId, userId: user?._id };
      const response = await axios.put('http://localhost:5002/recipe/dislike', payload);
      const updatedRecipe = response.data;
      setRecipes((prev) =>
        prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
      );
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  // Comment API call using input from the text field
  const handleSubmitComment = async (recipeId, e) => {
    e.stopPropagation();
    const comment = commentInputs[recipeId];
    if (!comment || !comment.trim()) return;

    try {
      const response = await axios.post('http://localhost:5002/recipe/comment', {
        comment,
        recipeId,
        userId: user?._id
      });
      const updatedRecipe = response.data;
      setRecipes((prev) =>
        prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
      );
      // Clear the comment input and collapse the comment box for that recipe
      setCommentInputs((prev) => ({ ...prev, [recipeId]: '' }));
      setOpenComments((prev) => ({ ...prev, [recipeId]: false }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Open the Recipe Details Modal and set the selected recipe
  const handleOpenDetails = (recipe, e) => {
    if (e) e.stopPropagation();
    setSelectedRecipe(recipe);
    setOpenDetailsModal(true);
  };

  // Close the Recipe Details Modal
  const handleCloseDetails = () => {
    setOpenDetailsModal(false);
    setSelectedRecipe(null);
  };

  return (
    <Box
      sx={{
        p: 2,
        background: 'linear-gradient(270deg, #d8cdda, #f2e1e5, #d8cdda)',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <LocalBarIcon sx={{ fontSize: 40, color: 'black' }} />
        <Typography variant="h3" sx={{ color: 'black', fontWeight: 'bold' }}>
          Cocktail &amp; Mocktail Recipes
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'black' }}>
          Discover and share the best drink recipes!
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ width: '400px', mr: 1, borderRadius: '20px' }}
          InputProps={{ sx: { borderRadius: '20px' } }}
        />
        <Button variant="contained" sx={{ backgroundColor: '#edb4c1', color: 'black' }} onClick={() => {}}>
          Search
        </Button>
      </Box>

      {/* Add Recipe Button */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Button variant="contained" sx={{ backgroundColor: '#edb4c1', color: 'black' }} onClick={handleOpenAddRecipeModal}>
          Add Recipe
        </Button>
      </Box>

      {/* Recipe List as Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {filteredRecipes.map((recipe) => {
          const recipeId = recipe._id || recipe.id;
          return (
            <Card
              key={recipeId}
              onClick={(e) => handleOpenDetails(recipe, e)}
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                p: 1,
                backgroundColor: '#ebd5da',
                mt: 2,
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  {recipe.name}
                </Typography>
              </CardContent>
              {/* Interactive Icons */}
              <Box sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={(e) => handleToggleLike(recipeId, e)}>
                    <FcLike size={24} />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {recipe.likeCount || recipe.likes || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={(e) => handleToggleDislike(recipeId, e)}>
                    <FcDislike size={24} />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {recipe.dislikeCount || recipe.dislikes || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={(e) =>
                      setOpenComments((prev) => ({
                        ...prev,
                        [recipeId]: !prev[recipeId]
                      }))
                    }
                  >
                    <FaRegComments size={24} />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {recipe.comments ? recipe.comments.length : 0}
                    </Typography>
                  </Box>
                </Box>
                {openComments[recipeId] && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Add Comment"
                      variant="outlined"
                      fullWidth
                      value={commentInputs[recipeId] || ''}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [recipeId]: e.target.value }))
                      }
                    />
                    <Button variant="contained" sx={{ mt: 1 }} onClick={(e) => handleSubmitComment(recipeId, e)}>
                      Submit Comment
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* Recipe Details Modal with improved UI */}
      <Dialog open={openDetailsModal} onClose={handleCloseDetails} fullWidth maxWidth="sm">
  <Card
    sx={{
      background: 'linear-gradient(270deg, #d8cdda, #f2e1e5, #d8cdda)',
      borderRadius: 2,
      overflow: 'hidden'
    }}
  >
    {/* Card Header */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundColor: '#f2e1e5'
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {selectedRecipe?.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FcLike size={24} />
          <Typography variant="subtitle1" sx={{ ml: 0.5 }}>
            {selectedRecipe?.likeCount || selectedRecipe?.likes || 0}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FcDislike size={24} />
          <Typography variant="subtitle1" sx={{ ml: 0.5 }}>
            {selectedRecipe?.dislikeCount || selectedRecipe?.dislikes || 0}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaRegComments size={24} />
          <Typography variant="subtitle1" sx={{ ml: 0.5 }}>
            {selectedRecipe?.comments ? selectedRecipe.comments.length : 0}
          </Typography>
        </Box>
      </Box>
    </Box>

    {/* Card Content */}
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Ingredients:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          {(selectedRecipe?.ingredients || selectedRecipe?.items || []).map((item, idx) => (
            <li key={idx}>
              <Typography variant="body2">
                {item.itemName} - {item.quantity}
              </Typography>
            </li>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Preparation Method:
        </Typography>
        <Typography variant="body2">{selectedRecipe?.method}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Glass Type:
        </Typography>
        <Typography variant="body2">
          {selectedRecipe?.bottles && selectedRecipe?.bottles.length
            ? selectedRecipe.bottles.join(', ')
            : 'No glass type added yet'}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Comments:
        </Typography>
        {selectedRecipe?.comments && selectedRecipe.comments.length > 0 ? (
          selectedRecipe.comments.map((com, idx) => (
            <Typography key={idx} variant="body2">
              - {com}
            </Typography>
          ))
        ) : (
          <Typography variant="body2">No comments yet.</Typography>
        )}
      </Box>
    </CardContent>

    {/* Card Actions / Footer */}
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <Button variant="outlined" onClick={handleCloseDetails}>
        Close
      </Button>
    </Box>
  </Card>
</Dialog>


      {/* Add Recipe Modal */}
      <Dialog
  open={openAddRecipeModal}
  onClose={handleCloseAddRecipeModal}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 2,
      background: 'linear-gradient(270deg, #d8cdda, #f2e1e5, #d8cdda)'
    }
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', mb: 1 }}>Add New Recipe</DialogTitle>
  <DialogContent dividers>
    <TextField
      label="Cocktail/Mocktail Name"
      variant="outlined"
      value={newRecipe.name}
      onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
      fullWidth
      sx={{ mb: 2 }}
    />
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Ingredient Name"
        variant="outlined"
        value={currentItem.itemName}
        onChange={(e) => setCurrentItem({ ...currentItem, itemName: e.target.value })}
      />
      <TextField
        label="Quantity"
        variant="outlined"
        value={currentItem.quantity}
        onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
      />
      <Button variant="contained" onClick={handleAddItem}>
        Add Ingredient
      </Button>
    </Box>
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1">Ingredients:</Typography>
      {newRecipe.items.map((item, index) => (
        <Typography key={`${item.itemName}-${index}`} variant="body2">
          - {item.itemName} : {item.quantity}
        </Typography>
      ))}
    </Box>
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Glass Type"
        variant="outlined"
        value={currentGlass}
        onChange={(e) => setCurrentGlass(e.target.value)}
      />
      <Button variant="contained" onClick={handleAddGlass}>
        Add Glass Type
      </Button>
    </Box>
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1">Glass Type(s):</Typography>
      {newRecipe.bottles.length > 0 ? (
        newRecipe.bottles.map((glass, index) => (
          <Typography key={`${glass}-${index}`} variant="body2">
            - {glass}
          </Typography>
        ))
      ) : (
        <Typography variant="body2">No glass type added yet</Typography>
      )}
    </Box>
    <Box sx={{ mb: 2 }}>
      <TextField
        label="Preparation Method"
        variant="outlined"
        multiline
        rows={4}
        value={newRecipe.method}
        onChange={(e) => setNewRecipe({ ...newRecipe, method: e.target.value })}
        fullWidth
      />
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseAddRecipeModal}>Cancel</Button>
    <Button variant="contained" onClick={handleSubmitRecipe}>
      Submit Recipe
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default Recipe;
