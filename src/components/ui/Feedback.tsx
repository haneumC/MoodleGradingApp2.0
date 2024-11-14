import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackItem {
  id: number;
  text: string;
  deduction: number;
  applied: boolean;
}

const Feedback: React.FC = () => {
  const defaultFeedback: FeedbackItem[] = [
    { id: 1, text: "Add more comments", deduction: 3, applied: false },
    { id: 2, text: "Poor indentation", deduction: 2, applied: false },
    { id: 3, text: "Looks good!", deduction: 0, applied: false },
    { id: 4, text: "No submission", deduction: 20, applied: false },
  ];

  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(defaultFeedback);
  const [isAddingFeedback, setIsAddingFeedback] = useState(false);
  const [newFeedback, setNewFeedback] = useState<Omit<FeedbackItem, 'id' | 'applied'>>({ 
    text: "", 
    deduction: 0 
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAddFeedback = () => {
    if (newFeedback.text.trim()) {
      setFeedbackItems([
        ...feedbackItems,
        {
          id: Date.now(),
          text: newFeedback.text,
          deduction: Number(newFeedback.deduction),
          applied: false
        }
      ]);
      setNewFeedback({ text: "", deduction: 0 });
      setIsAddingFeedback(false);
    }
  };

  const handleStartEdit = (item: FeedbackItem) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const handleAcceptEdit = (id: number) => {
    setFeedbackItems(feedbackItems.map(item =>
      item.id === id ? { ...item, text: editingText } : item
    ));
    setEditingId(null);
  };

  const handleRejectEdit = () => {
    setEditingId(null);
  };

  const handleDeleteFeedback = (id: number) => {
    setFeedbackItems(feedbackItems.filter(item => item.id !== id));
  };

  return (
    <div className="bg-[#1e1e1e] p-4 rounded-md h-[calc(100vh-380px)] flex flex-col mt-5">
      <Table>
        <TableHeader className="border-b border-[#444]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[#e1e1e1]">Feedback</TableHead>
            <TableHead className="w-[100px] text-[#e1e1e1]">Deduction</TableHead>
            <TableHead className="w-[80px] text-[#e1e1e1]">Apply</TableHead>
            <TableHead className="w-[100px] text-[#e1e1e1]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbackItems.map((item) => (
            <TableRow key={item.id} className="border-b border-[#333] hover:bg-[#2d2d2d]">
              {editingId === item.id ? (
                <>
                  <TableCell>
                    <Textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="bg-[#2d2d2d] border-[#444] text-white min-h-[60px] resize-y"
                    />
                  </TableCell>
                  <TableCell className="text-right pr-5 text-white">{item.deduction}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleAcceptEdit(item.id)}
                        className="bg-[#4CAF50] hover:bg-[#45a049] text-white"
                        size="sm"
                      >
                        ✓
                      </Button>
                      <Button 
                        onClick={handleRejectEdit}
                        className="bg-[#f44336] hover:bg-[#d32f2f] text-white"
                        size="sm"
                      >
                        ✕
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => handleStartEdit(item)}
                  >
                    <div className="bg-[#3a3f4b] text-[#e1e1e1] p-2 rounded border-l-4 border-[#5c6bc0] hover:bg-[#454b5a] transition-colors whitespace-pre-wrap break-words">
                      {item.text}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-5 text-white">{item.deduction}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={item.applied}
                      onCheckedChange={() => {
                        setFeedbackItems(feedbackItems.map(feedback => 
                          feedback.id === item.id 
                            ? { ...feedback, applied: !feedback.applied }
                            : feedback
                        ));
                      }}
                      className="border-white data-[state=checked]:bg-[#4CAF50] data-[state=checked]:border-[#4CAF50]"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFeedback(item.id)}
                      className="text-[#f44336] hover:text-[#d32f2f] hover:bg-transparent"
                    >
                      ×
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isAddingFeedback ? (
        <div className="mt-4 p-4 bg-[#2d2d2d] rounded-md space-y-4">
          <Textarea
            value={newFeedback.text}
            onChange={(e) => setNewFeedback({ ...newFeedback, text: e.target.value })}
            placeholder="Enter feedback text"
            className="bg-[#3a3f4b] border-[#444] text-white min-h-[60px] resize-y"
          />
          <Input
            type="number"
            value={newFeedback.deduction}
            onChange={(e) => setNewFeedback({ ...newFeedback, deduction: Number(e.target.value) })}
            placeholder="Deduction"
            min={0}
            max={20}
            className="w-[100px] bg-[#3a3f4b] border-[#444] text-white"
          />
          <div className="flex space-x-2">
            <Button 
              onClick={handleAddFeedback}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white"
            >
              Add
            </Button>
            <Button 
              onClick={() => setIsAddingFeedback(false)}
              className="bg-[#f44336] hover:bg-[#d32f2f] text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => setIsAddingFeedback(true)}
          className="mt-4 w-full bg-[#4CAF50] hover:bg-[#45a049] text-white"
        >
          Add Feedback
        </Button>
      )}
    </div>
  );
};

export default Feedback;
