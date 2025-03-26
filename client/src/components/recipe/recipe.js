import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Collapse
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Recipe = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [recipes, setRecipes] = useState([]); // Start with an empty array
    const [showAddRecipe, setShowAddRecipe] = useState(false);

    // State for the new recipe form
    const [newRecipe, setNewRecipe] = useState({
        name: '',
        items: [],
        method: '',
        bottles: []
    });

    // Temporary state for the current item being added
    const [currentItem, setCurrentItem] = useState({
        itemName: '',
        quantity: ''
    });

    // Fetch recipes from the database on mount
    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:5002/recipe/');
            const fetchedRecipes = response.data;
            setRecipes(fetchedRecipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    // Handle changes in the search field
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Toggle the add recipe form
    const handleAddRecipe = () => {
        setShowAddRecipe((prev) => !prev);
    };

    // Add an item to the new recipe's items array
    const handleAddItem = () => {
        if (currentItem.itemName.trim() && currentItem.quantity.trim()) {
            setNewRecipe((prev) => ({
                ...prev,
                items: [...prev.items, currentItem]
            }));
            // Reset the current item fields
            setCurrentItem({ itemName: '', quantity: '' });
        }
    };

    const handleSubmitRecipe = async () => {
        try {
            // Construct the object according to your Mongoose schema:
            const payload = {
                name: newRecipe.name,
                ingredients: newRecipe.items,  // 'items' from your form mapped to "ingredients" field
                bottles: newRecipe.bottles,
                method: newRecipe.method,
                userName: user?.username,
                byUserId: user?._id
            };

            const response = await axios.post('http://localhost:5002/recipe/', payload);
            const savedRecipe = response.data;
            setRecipes((prev) => [...prev, savedRecipe]);

            // Reset the form and collapse the "Add Recipe" section
            setNewRecipe({ name: '', items: [], method: '', bottles: [] });
            setShowAddRecipe(false);
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    };

    // Function to toggle like
    const handleToggleLike = async (recipeId) => {
        try {
            const payload = {
                recipeId,
                userId: user?._id
            };
            const response = await axios.put('http://localhost:5002/recipe/like', payload);
            const updatedRecipe = response.data;
            setRecipes((prev) =>
                prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
            );
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Function to toggle dislike
    const handleToggleDislike = async (recipeId) => {
        try {
            const payload = {
                recipeId,
                userId: user?._id
            };
            const response = await axios.put('http://localhost:5002/recipe/dislike', payload);
            const updatedRecipe = response.data;
            setRecipes((prev) =>
                prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
            );
        } catch (error) {
            console.error('Error toggling dislike:', error);
        }
    };

    // Function to handle adding a comment to a recipe
    const handleAddComment = async (recipeId) => {
        const comment = window.prompt('Enter your comment:');
        if (!comment) return;

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
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Filter recipes by the search term (case-insensitive)
    const filteredRecipes = recipes.filter((recipe) =>
        (recipe.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Recipe Page
            </Typography>

            {/* Search Bar */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Search Recipe"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                />
            </Box>

            {/* Add Recipe Button */}
            <Box sx={{ mb: 2 }}>
                <Button variant="contained" onClick={handleAddRecipe}>
                    {showAddRecipe ? 'Cancel' : 'Add Recipe'}
                </Button>
            </Box>

            {/* Collapsible Form for Adding a New Recipe */}
            <Collapse in={showAddRecipe}>
                <Box sx={{ mb: 2, border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
                    <TextField
                        label="Recipe Name"
                        variant="outlined"
                        value={newRecipe.name}
                        onChange={(e) =>
                            setNewRecipe({ ...newRecipe, name: e.target.value })
                        }
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label="Item Name"
                            variant="outlined"
                            value={currentItem.itemName}
                            onChange={(e) =>
                                setCurrentItem({ ...currentItem, itemName: e.target.value })
                            }
                        />
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            value={currentItem.quantity}
                            onChange={(e) =>
                                setCurrentItem({ ...currentItem, quantity: e.target.value })
                            }
                        />
                        <Button variant="contained" onClick={handleAddItem}>
                            Add Item
                        </Button>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Items:</Typography>
                        {newRecipe.items.map((item, index) => (
                            <Typography key={`${item.itemName}-${index}`} variant="body2">
                                - {item.itemName} : {item.quantity}
                            </Typography>
                        ))}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Bottles (Placeholder):</Typography>
                        <Typography variant="body2">
                            Here you can add logic to attach bottles to the recipe.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Method"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={newRecipe.method}
                            onChange={(e) =>
                                setNewRecipe({ ...newRecipe, method: e.target.value })
                            }
                            fullWidth
                        />
                    </Box>

                    <Button variant="contained" color="primary" onClick={handleSubmitRecipe}>
                        Submit Recipe
                    </Button>
                </Box>
            </Collapse>

            {/* Recipe List */}
            <Typography variant="h5" gutterBottom>
                Recipe List
            </Typography>
            {filteredRecipes?.map((recipe) => {
                // Check if current user has liked/disliked the recipe
                const isLiked = recipe.likedusers?.includes(user?._id);
                const isDisliked = recipe.dislikedusers?.includes(user?._id);
                return (
                    <Card key={recipe._id || recipe.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{recipe.name}</Typography>
                            <Typography variant="subtitle2">Items:</Typography>
                            <ul>
                                {(recipe.items || recipe.ingredients || []).map((item, idx) => (
                                    <li key={`${item.itemName}-${idx}`}>
                                        {item.itemName} - {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <Typography variant="subtitle2">Method:</Typography>
                            <Typography variant="body2">{recipe.method}</Typography>
                            <Typography variant="subtitle2">Bottles:</Typography>
                            <Typography variant="body2">
                                {recipe.bottles && recipe.bottles.length
                                    ? recipe.bottles.join(', ')
                                    : 'No bottles added yet'}
                            </Typography>
                            {/* Icons for Like, Dislike and Comment */}
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                    onClick={() => handleToggleLike(recipe._id || recipe.id)}
                                >
                                    <ThumbUpIcon color={isLiked ? "primary" : "action"} />
                                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                                        {recipe.likes || 0}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                    onClick={() => handleToggleDislike(recipe._id || recipe.id)}
                                >
                                    <ThumbDownIcon color={isDisliked ? "error" : "action"} />
                                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                                        {recipe.dislikes || 0}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                    onClick={() => handleAddComment(recipe._id || recipe.id)}
                                >
                                    <CommentIcon color="action" />
                                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                                        {recipe.comments ? recipe.comments.length : 0}
                                    </Typography>
                                </Box>
                            </Box>
                            {/* Display comments if available */}
                            {recipe.comments && recipe.comments.length > 0 && (
                                <Box sx={{ mt: 1, pl: 2 }}>
                                    <Typography variant="subtitle2">Comments:</Typography>
                                    {recipe.comments.map((com, idx) => (
                                        <Typography key={idx} variant="body2">
                                            - {com}
                                        </Typography>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
};

export default Recipe;